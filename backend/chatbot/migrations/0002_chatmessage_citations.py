from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("chatbot", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="chatmessage",
            name="citations",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
