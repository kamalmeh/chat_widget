from django.db import models
from django.utils import timezone

class Current_Logged_On_User(models.Model):
    session_id = models.TextField(
        verbose_name="Visitor's Chat Session Id", 
        max_length=128, 
        unique=True,
        null=False,
        default="Unknown",
        primary_key=True, db_index=True, blank=False
    )
    client_id = models.TextField(
        verbose_name="Visitor's Unique Client Id", 
        max_length=128, 
        unique=False,
        null=False,
        default="Unknown", blank=False
    )

    def __str__(self):
        return self.Meta.verbose_name_plural

    class Meta:
        verbose_name = 'Current_Logged_On_User'
        verbose_name_plural = 'Current_Logged_On_Users'

class Agent(models.Model):
    first_name = models.TextField(
        verbose_name="Agent's First Name", 
        max_length=50, 
        unique=False,
        null=True,
        default="Unknown", blank=False
    )
    last_name = models.TextField(
        verbose_name="Agent's Last Name", 
        max_length=50, 
        unique=False,
        null=True,
        default="Unknown", blank=False
    )

    def __str__(self):
        return self.Meta.verbose_name_plural

    class Meta:
        verbose_name = 'Agent'
        verbose_name_plural = 'Agents'

class Visitor(models.Model):
    session_id = models.TextField(
        verbose_name="Visitor's Chat Session Id", 
        max_length=128, 
        unique=True,
        null=False,
        default="Unknown",
        primary_key=True, db_index=True, blank=False
    )
    client_id = models.TextField(
        verbose_name="Visitor's Unique Client Id", 
        max_length=128, 
        unique=False,
        null=False,
        default="Unknown", blank=False
    )
    agent_id = models.ForeignKey(Agent, related_name="agent", on_delete=models.PROTECT, default=0)
    first_name = models.TextField(
        verbose_name="Visitor's First Name", 
        max_length=50, 
        unique=False,
        null=True,
        default="Unknown", blank=False
    )
    last_name = models.TextField(
        verbose_name="Visitor's Last Name", 
        max_length=50, 
        unique=False,
        null=True,
        default="Unknown", blank=False
    )
    timestamp = models.DateTimeField(
        verbose_name="Date Time of Visitor",
        name="Date & Time",
        default=timezone.now
    )

    def __str__(self):
        return self.Meta.verbose_name_plural

    class Meta:
        verbose_name = 'Visitor'
        verbose_name_plural = 'Visitors'

class ChatHistory(models.Model):
    session_id = models.ForeignKey(Visitor, related_name="history", on_delete=models.PROTECT)

    def __str__(self):
        return self.Meta.verbose_name_plural

    class Meta:
        verbose_name = 'ChatHistory'
        verbose_name_plural = 'ChatHistory'