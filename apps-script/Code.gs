// Google Calendar bridge, called ONLY by the Supabase gcal-sync function.
// Every request must carry the secret token; the browser never talks to this script.
//
// Setup: Project Settings > Script properties > add SYNC_TOKEN (a long random string).
// Deploy as a NEW web app deployment (Execute as: Me, Who has access: Anyone) and use its URL.
// The old deployment keeps running the old code until you switch the live site over.

const CALENDAR_ID = 'primary';

function cal_() {
  return CalendarApp.getCalendarById(CALENDAR_ID) || CalendarApp.getDefaultCalendar();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ success: true, message: 'ok' });   // no data over GET
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SYNC_TOKEN');
    if (!expected || data.token !== expected) return json_({ success: false, error: 'unauthorized' });

    const p = data.payload || {};
    switch (data.action) {
      case 'ping':        return json_({ success: true });
      case 'getEvents':   return json_(getEvents_(p));
      case 'createEvent': return json_(createEvent_(p));
      case 'updateEvent': return json_(updateEvent_(p));
      case 'deleteEvent': return json_(deleteEvent_(p));
      default:            return json_({ success: false, error: 'Unknown action' });
    }
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function getEvents_(p) {
  const events = cal_().getEvents(new Date(p.timeMin), new Date(p.timeMax));
  return {
    success: true,
    events: events.map(function (ev) {
      return {
        googleEventId: ev.getId(),
        start: ev.getStartTime().toISOString(),
        end: ev.getEndTime().toISOString(),
        isAllDay: ev.isAllDayEvent(),
        title: ev.getTitle()
      };
    })
  };
}

function isGmail_(e) {
  return !!e && /@(gmail|googlemail)\.com$/i.test(String(e).trim());
}

// Δημιουργεί το event. Αν ο μαθητής έχει Gmail, του στέλνει πρόσκληση.
// Με ενεργό το "Google Calendar API" στις Services του project, προσθέτει και σύνδεσμο Google Meet.
function createEvent_(p) {
  const title = p.title || 'Μάθημα';
  const start = new Date(p.startTime);
  const end = new Date(p.endTime);
  const guest = isGmail_(p.guestEmail) ? String(p.guestEmail).trim().toLowerCase() : null;

  if (typeof Calendar !== 'undefined' && Calendar.Events) {
    try {
      const res = Calendar.Events.insert({
        summary: title,
        description: p.notes || '',
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: guest ? [{ email: guest }] : [],
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }, { method: 'popup', minutes: 15 }] },
        conferenceData: { createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } } }
      }, CALENDAR_ID, { conferenceDataVersion: 1, sendUpdates: guest ? 'all' : 'none' });
      return { success: true, googleEventId: res.iCalUID, invited: !!guest, meet: true };
    } catch (err) {
      // πέφτουμε στην απλή δημιουργία παρακάτω
    }
  }

  const opts = { description: p.notes || '' };
  if (guest) { opts.guests = guest; opts.sendInvites = true; }
  const ev = cal_().createEvent(title, start, end, opts);
  ev.addPopupReminder(60);
  ev.addPopupReminder(15);
  return { success: true, googleEventId: ev.getId(), invited: !!guest, meet: false };
}

function updateEvent_(p) {
  const ev = cal_().getEventById(p.googleEventId);
  if (!ev) return { success: false, error: 'Event not found' };
  if (p.title) ev.setTitle(p.title);
  if (p.notes !== undefined) ev.setDescription(p.notes);
  if (p.startTime && p.endTime) ev.setTime(new Date(p.startTime), new Date(p.endTime));
  return { success: true, googleEventId: ev.getId() };
}

function deleteEvent_(p) {
  const ev = cal_().getEventById(p.googleEventId);
  if (!ev) return { success: false, error: 'Event not found' };
  ev.deleteEvent();
  return { success: true };
}
