import { cookies } from "next/headers";
import { notifyCurriculumAdded } from "@/lib/notifications/actions";
import { addCurriculum } from "@/lib/db/queries/curriculum";

export async function POST(request, { params }) {
  try {
    const instructor_user_id = cookies().get("user_id")?.value;

    if (!instructor_user_id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course_id = params.courseId;
    const body = await request.json();

    const curriculum = await addCurriculum(course_id, body);

    await notifyCurriculumAdded(
      {
        id: course_id,
        title: curriculum.course_title,
        slug: curriculum.course_slug,
      },
      instructor_user_id
    );

    return Response.json({ success: true, curriculum });
  } catch (error) {
    console.error("❌ Curriculum API Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
