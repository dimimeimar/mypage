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

function createEvent_(p) {
  const ev = cal_().createEvent(p.title || 'Μάθημα', new Date(p.startTime), new Date(p.endTime), { description: p.notes || '' });
  ev.addPopupReminder(60);
  ev.addPopupReminder(15);
  return { success: true, googleEventId: ev.getId() };
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
