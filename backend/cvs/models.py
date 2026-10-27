import os
from django.db import models
from django.contrib.auth.models import User

def cv_upload_path(instance, filename):
    return f'user_{instance.user.id}/cvs/{filename}'

class CV(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cvs')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=cv_upload_path)
    content = models.TextField(blank=True)  # Extracted text content
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username}'s CV - {self.title}"
    
    def file_extension(self):
        return os.path.splitext(self.file.name)[1].lower()