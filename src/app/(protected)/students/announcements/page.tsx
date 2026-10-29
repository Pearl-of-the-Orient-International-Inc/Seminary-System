import { AnnouncementCalendar } from "../../portal/announcement/_components/AnnouncementCalendar";

export default function StudentAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2f6b3c]">Student portal</p>
        <h1 className="font-serif text-3xl font-semibold">Announcements and events</h1>
        <p className="mt-1 text-muted-foreground">
          Stay up to date with Seminary notices, activities, and important dates.
        </p>
      </div>
      <AnnouncementCalendar />
    </div>
  );
}
