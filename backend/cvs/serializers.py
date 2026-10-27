from rest_framework import serializers
from .models import CV

class CVSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CV
        fields = ('id', 'title', 'file', 'file_url', 'content', 'is_processed', 'created_at', 'updated_at')
        read_only_fields = ('content', 'is_processed', 'created_at', 'updated_at')
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url') and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def validate_file(self, value):
        allowed_extensions = {'.pdf', '.docx'}
        extension = value.name[value.name.rfind('.'):].lower()
        if extension not in allowed_extensions:
            raise serializers.ValidationError('Only PDF and DOCX resumes are supported.')
        if value.size > 8 * 1024 * 1024:
            raise serializers.ValidationError('Resume uploads must be 8 MB or smaller.')
        return value
