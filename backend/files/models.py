import os
import logging
from django.db import models
from django.core.files.storage import FileSystemStorage
from django.db.models import Sum
from django.utils import timezone

logger = logging.getLogger(__name__)

class File(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='files/')
    size = models.PositiveIntegerField()
    file_type = models.CharField(max_length=50)
    upload_date = models.DateTimeField(auto_now_add=True)
    original_file = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='duplicates')
    is_duplicate = models.BooleanField(default=False)
    
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
        if not self.pk:  # Only on creation
            self.size = self.file.size
            self.name = os.path.basename(self.file.name)
            self.file_type = os.path.splitext(self.file.name)[1][1:].lower()
            
            # Check for duplicates
            existing_file = File.objects.filter(
                size=self.size,
                file_type=self.file_type
            ).first()
            
            if existing_file:
                logger.info(f"Found duplicate file: {self.name}")
                self.original_file = existing_file
                self.is_duplicate = True
                # Don't save the actual file for duplicates
                self.file = existing_file.file
            else:
                logger.info(f"New unique file: {self.name}")
                
        super().save(*args, **kwargs)
    
    @classmethod
    def get_storage_savings(cls):
        duplicates = cls.objects.filter(is_duplicate=True)
        total_saved = duplicates.aggregate(total=Sum('size'))['total'] or 0
        return total_saved