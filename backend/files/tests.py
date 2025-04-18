from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import File
from django.urls import reverse
from rest_framework.test import APIClient
import os
import tempfile

class FileModelTests(TestCase):
    def setUp(self):
        # Create a temporary file for testing
        self.temp_file = tempfile.NamedTemporaryFile(delete=False)
        self.temp_file.write(b'Test file content')
        self.temp_file.close()

    def tearDown(self):
        # Clean up temporary files
        os.unlink(self.temp_file.name)
        for file in File.objects.all():
            if os.path.exists(file.file.path):
                os.remove(file.file.path)

    def test_file_creation(self):
        """Test basic file creation"""
        file = File.objects.create(
            name='test.txt',
            file=SimpleUploadedFile('test.txt', b'Test content'),
            size=12,
            file_type='txt'
        )
        self.assertEqual(file.name, 'test.txt')
        self.assertEqual(file.file_type, 'txt')
        self.assertEqual(file.size, 12)
        self.assertFalse(file.is_duplicate)

    def test_duplicate_detection(self):
        """Test that duplicate files are correctly identified"""
        # Create first file
        file1 = File.objects.create(
            name='test.txt',
            file=SimpleUploadedFile('test.txt', b'Test content'),
            size=12,
            file_type='txt'
        )
        
        # Create second file with same content
        file2 = File.objects.create(
            name='test_copy.txt',
            file=SimpleUploadedFile('test_copy.txt', b'Test content'),
            size=12,
            file_type='txt'
        )
        
        self.assertTrue(file2.is_duplicate)
        self.assertEqual(file2.original_file, file1)

    def test_unique_file_types(self):
        """Test that file types are correctly handled"""
        # Create files with different types
        File.objects.create(
            name='test1.txt',
            file=SimpleUploadedFile('test1.txt', b'Content 1'),
            size=10,
            file_type='txt'
        )
        File.objects.create(
            name='test2.pdf',
            file=SimpleUploadedFile('test2.pdf', b'Content 2'),
            size=10,
            file_type='pdf'
        )
        File.objects.create(
            name='test3.txt',
            file=SimpleUploadedFile('test3.txt', b'Content 3'),
            size=10,
            file_type='txt'
        )

        # Get unique file types
        unique_types = set(File.objects.values_list('file_type', flat=True))
        self.assertEqual(len(unique_types), 2)  # Should only have 'txt' and 'pdf'

class FileViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.file_url = reverse('file-list')
        self.stats_url = reverse('file-stats')
        self.file_types_url = reverse('file-file-types')

        # Create test files
        self.file1 = File.objects.create(
            name='test1.txt',
            file=SimpleUploadedFile('test1.txt', b'Content 1'),
            size=10,
            file_type='txt'
        )
        self.file2 = File.objects.create(
            name='test2.pdf',
            file=SimpleUploadedFile('test2.pdf', b'Content 2'),
            size=20,
            file_type='pdf'
        )

    def test_file_list_endpoint(self):
        """Test the file list endpoint"""
        response = self.client.get(self.file_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_file_filtering(self):
        """Test file filtering by type"""
        response = self.client.get(f'{self.file_url}?file_type=txt')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['file_type'], 'txt')

    def test_stats_endpoint(self):
        """Test the stats endpoint"""
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_files'], 2)
        self.assertEqual(response.data['unique_files'], 2)
        self.assertEqual(response.data['duplicate_files'], 0)

    def test_file_types_endpoint(self):
        """Test the file types endpoint"""
        response = self.client.get(self.file_types_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertIn('txt', response.data)
        self.assertIn('pdf', response.data) 