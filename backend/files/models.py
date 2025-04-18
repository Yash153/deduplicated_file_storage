import os
import logging
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.db.models import Sum
from django.utils import timezone
import hashlib

logger = logging.getLogger(__name__)

class File(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    size = models.BigIntegerField()
    file_type = models.CharField(max_length=50)
    upload_date = models.DateTimeField(auto_now_add=True)
    hash = models.CharField(max_length=64, unique=True, null=True, blank=True)
    is_duplicate = models.BooleanField(default=False)
    original_file = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='duplicates')
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['file_type']),
            models.Index(fields=['size']),
            models.Index(fields=['upload_date']),
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.file and not self.name:
            self.name = os.path.basename(self.file.name)
    
    def save(self, *args, **kwargs):
        if not self.hash and self.file:
            # Calculate SHA-256 hash of the file
            self.file.seek(0)
            file_hash = hashlib.sha256()
            while chunk := self.file.read(8192):
                file_hash.update(chunk)
            self.hash = file_hash.hexdigest()
            self.file.seek(0)

            # Check for existing files with the same hash
            existing_file = File.objects.filter(hash=self.hash).exclude(id=self.id).first()
            if existing_file:
                self.is_duplicate = True
                self.original_file = existing_file
            else:
                self.is_duplicate = False
                self.original_file = None

        if not self.pk:  # Only on creation
            self.size = self.file.size
            self.name = os.path.basename(self.file.name)
            self.file_type = os.path.splitext(self.file.name)[1][1:].lower()
            
        super().save(*args, **kwargs)
    
    @classmethod
    def get_storage_savings(cls):
        duplicates = cls.objects.filter(is_duplicate=True)
        total_saved = duplicates.aggregate(total=Sum('size'))['total'] or 0
        return total_saved

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-upload_date']