import CurriculumDisplay from "./curriculum/curriculum-display";

export default function CourseDetails({ course, curriculum }: any) {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-600 mt-2">{course.description}</p>

      {/* AFFICHER CURRICULUM NAN */}
      <CurriculumDisplay modules={curriculum} />
    </div>
  );
}
