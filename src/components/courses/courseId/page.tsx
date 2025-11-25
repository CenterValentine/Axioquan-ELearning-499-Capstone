import CourseDetails from "@/components/course-details";
//import { getCourseById, getCurriculumByCourse } from "@/lib/db/index";

export default async function CoursePage({ params }: any) {
  const courseId = params.courseId;

  //const course = await getCourseById(courseId);
  //const curriculum = await getCurriculumByCourse(courseId);
  const course = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${params.id}`)
  .then(res => res.json());

const curriculum = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${params.id}/modules`)
  .then(res => res.json());


  return (
    <CourseDetails course={course} curriculum={curriculum} />
  );
}
