from django.db import migrations

def create_data(apps, schema_editor):
    FeedbackType = apps.get_model('api', 'FeedbackType')
    FeedbackType(name="bugreport").save()
    FeedbackType(name="comment").save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_demo_feedbacktype_instance_feedback'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
