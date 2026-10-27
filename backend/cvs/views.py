import os
import PyPDF2
import docx
from rest_framework import viewsets, permissions
from .models import CV
from .serializers import CVSerializer

class CVViewSet(viewsets.ModelViewSet):
    serializer_class = CVSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CV.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        cv = serializer.save(user=self.request.user)
        self.extract_text(cv)
    
    def perform_update(self, serializer):
        cv = serializer.save()
        self.extract_text(cv)
    
    def extract_text(self, cv):
        """Extract text content from the CV file based on its format."""
        content = ""
        file_ext = cv.file_extension()
        
        try:
            # For PDF files
            if file_ext == '.pdf':
                with cv.file.open('rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page_num in range(len(pdf_reader.pages)):
                        content += pdf_reader.pages[page_num].extract_text()
            
            # For DOCX files
            elif file_ext == '.docx':
                with cv.file.open('rb') as file:
                    doc = docx.Document(file)
                    for para in doc.paragraphs:
                        content += para.text + '\n'
            
            # Save the extracted content
            cv.content = content
            cv.is_processed = True
            cv.save()
        
        except Exception as e:
            print(f"Error extracting text from CV: {e}")
            cv.content = f"Error processing file: {str(e)}"
            cv.is_processed = False
            cv.save()