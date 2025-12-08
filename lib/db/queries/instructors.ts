
// // /lib/db/queries/instructors.ts
// import { sql } from '../index';

// export interface InstructorProfile {
//   id: string;
//   name: string;
//   bio?: string;
//   image?: string;
//   headline?: string;
//   website?: string;
//   linkedin_url?: string;
//   youtube_channel?: string;
//   skills?: string[];
//   total_courses: number;
//   total_students: number;
//   average_rating: number;
//   created_at: Date;
// }

// export interface InstructorWithCourses extends InstructorProfile {
//   courses: Array<{
//     id: string;
//     slug: string;
//     title: string;
//     thumbnail_url?: string;
//     enrolled_students_count: number;
//     average_rating: number;
//     difficulty_level: string;
//   }>;
// }

// /**
//  * Helper: Fetch the instructor role ID
//  */
// async function getInstructorRoleId(): Promise<string | null> {
//   const role = await sql`
//     SELECT id FROM roles WHERE name = 'instructor' LIMIT 1
//   `;
//   return role[0]?.id || null;
// }

// /**
//  * Get all instructors with their basic profile information
//  * Using role_id instead of role name
//  */
// export async function getAllInstructors(): Promise<InstructorProfile[]> {
//   try {
//     const instructorRoleId = await getInstructorRoleId();
//     if (!instructorRoleId) {
//       console.warn("⚠️ No 'instructor' role found in roles table.");
//       return [];
//     }

//     const instructors = await sql`
//       SELECT 
//         u.id,
//         u.name,
//         u.bio,
//         u.image,
//         up.headline,
//         up.website,
//         up.linkedin_url,
//         up.youtube_channel,
//         up.skills,
//         u.created_at,
//         COUNT(DISTINCT c.id) AS total_courses,
//         COALESCE(SUM(c.enrolled_students_count), 0) AS total_students,
//         COALESCE(AVG(c.average_rating), 0) AS average_rating
//       FROM users u
//       INNER JOIN user_roles ur ON u.id = ur.user_id
//       LEFT JOIN user_profiles up ON u.id = up.user_id
//       LEFT JOIN courses c ON u.id = c.instructor_id AND c.is_published = true
//       WHERE ur.role_id = ${instructorRoleId}
//         AND u.is_active = true
//       GROUP BY 
//         u.id, u.name, u.bio, u.image,
//         up.headline, up.website, 
//         up.linkedin_url, up.youtube_channel, up.skills, 
//         u.created_at
//       ORDER BY total_courses DESC, u.name ASC
//     `;

//     return instructors.map(instructor => ({
//       id: instructor.id,
//       name: instructor.name,
//       bio: instructor.bio,
//       image: instructor.image,
//       headline: instructor.headline,
//       website: instructor.website,
//       linkedin_url: instructor.linkedin_url,
//       youtube_channel: instructor.youtube_channel,
//       skills: instructor.skills,
//       created_at: instructor.created_at,
//       total_courses: parseInt(instructor.total_courses) || 0,
//       total_students: parseInt(instructor.total_students) || 0,
//       average_rating: parseFloat(instructor.average_rating) || 0,
//     }));
//   } catch (error) {
//     console.error('❌ Error fetching instructors:', error);
//     throw new Error('Failed to fetch instructors');
//   }
// }

// /**
//  * Get single instructor with detailed information including their courses
//  */
// export async function getInstructorById(
//   instructorId: string
// ): Promise<InstructorWithCourses | null> {
//   try {
//     const instructorRoleId = await getInstructorRoleId();
//     if (!instructorRoleId) return null;

//     const instructorData = await sql`
//       SELECT 
//         u.id,
//         u.name,
//         u.bio,
//         u.image,
//         up.headline,
//         up.website,
//         up.linkedin_url,
//         up.youtube_channel,
//         up.skills,
//         u.created_at
//       FROM users u
//       INNER JOIN user_roles ur ON u.id = ur.user_id
//       LEFT JOIN user_profiles up ON u.id = up.user_id
//       WHERE u.id = ${instructorId}
//         AND ur.role_id = ${instructorRoleId}
//         AND u.is_active = true
//       LIMIT 1
//     `;

//     if (instructorData.length === 0) {
//       return null;
//     }

//     const courses = await sql`
//       SELECT 
//         id,
//         slug,
//         title,
//         thumbnail_url,
//         enrolled_students_count,
//         average_rating,
//         difficulty_level
//       FROM courses
//       WHERE instructor_id = ${instructorId}
//         AND is_published = true
//       ORDER BY enrolled_students_count DESC, created_at DESC
//     `;

//     const stats = await sql`
//       SELECT 
//         COUNT(DISTINCT c.id) AS total_courses,
//         COALESCE(SUM(c.enrolled_students_count), 0) AS total_students,
//         COALESCE(AVG(c.average_rating), 0) AS average_rating
//       FROM courses c
//       WHERE c.instructor_id = ${instructorId}
//         AND c.is_published = true
//     `;

//     const instructor = instructorData[0];
//     const s = stats[0];

//     return {
//       id: instructor.id,
//       name: instructor.name,
//       bio: instructor.bio,
//       image: instructor.image,
//       headline: instructor.headline,
//       website: instructor.website,
//       linkedin_url: instructor.linkedin_url,
//       youtube_channel: instructor.youtube_channel,
//       skills: instructor.skills,
//       created_at: instructor.created_at,
//       total_courses: parseInt(s.total_courses) || 0,
//       total_students: parseInt(s.total_students) || 0,
//       average_rating: parseFloat(s.average_rating) || 0,
//       courses: courses.map(course => ({
//         id: course.id,
//         slug: course.slug,
//         title: course.title,
//         thumbnail_url: course.thumbnail_url,
//         difficulty_level: course.difficulty_level,
//         enrolled_students_count:
//           parseInt(course.enrolled_students_count) || 0,
//         average_rating: parseFloat(course.average_rating) || 0,
//       })),
//     };
//   } catch (error) {
//     console.error('❌ Error fetching instructor details:', error);
//     throw new Error('Failed to fetch instructor details');
//   }
// }

// /**
//  * Get instructor statistics
//  */
// export async function getInstructorStats(instructorId: string) {
//   try {
//     const stats = await sql`
//       SELECT 
//         COUNT(DISTINCT c.id) AS total_courses,
//         COALESCE(SUM(c.enrolled_students_count), 0) AS total_students,
//         COALESCE(AVG(c.average_rating), 0) AS average_rating,
//         COUNT(DISTINCT CASE WHEN c.is_featured = true THEN c.id END) AS featured_courses
//       FROM courses c
//       WHERE c.instructor_id = ${instructorId}
//         AND c.is_published = true
//     `;

//     const s = stats[0];
//     return {
//       total_courses: parseInt(s.total_courses) || 0,
//       total_students: parseInt(s.total_students) || 0,
//       average_rating: parseFloat(s.average_rating) || 0,
//       featured_courses: parseInt(s.featured_courses) || 0,
//     };
//   } catch (error) {
//     console.error('❌ Error fetching instructor stats:', error);
//     return {
//       total_courses: 0,
//       total_students: 0,
//       average_rating: 0,
//       featured_courses: 0,
//     };
//   }
// }


// /lib/db/queries/instructors.ts
import { sql } from '../index';

export interface InstructorProfile {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  headline?: string;
  website?: string;
  linkedin_url?: string;
  youtube_channel?: string;
  skills?: string[];
  total_courses: number;
  total_students: number;
  average_rating: number;
  created_at: Date;
}

export interface InstructorWithCourses extends InstructorProfile {
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    thumbnail_url?: string;
    enrolled_students_count: number;
    average_rating: number;
    difficulty_level: string;
  }>;
}

/**
 * Helper: Fetch the instructor role ID with detailed logging
 */
async function getInstructorRoleId(): Promise<string | null> {
  try {
    console.log('🔍 Looking for instructor role...');
    
    // First, let's see all roles
    const allRoles = await sql`SELECT id, name FROM roles ORDER BY name`;
    console.log('📋 All roles in database:', allRoles);
    
    const role = await sql`
      SELECT id FROM roles WHERE name = 'instructor' LIMIT 1
    `;
    
    if (role.length === 0) {
      console.error('❌ No instructor role found in roles table!');
      console.log('💡 Available roles:', allRoles.map(r => r.name).join(', '));
      return null;
    }
    
    console.log('✅ Found instructor role:', role[0].id);
    return role[0].id;
  } catch (error) {
    console.error('❌ Error fetching instructor role:', error);
    return null;
  }
}

/**
 * Get all instructors with their basic profile information
 * FIXED: Better error handling and debugging
 */
export async function getAllInstructors(): Promise<InstructorProfile[]> {
  try {
    console.log('🚀 Starting getAllInstructors()...');
    
    const instructorRoleId = await getInstructorRoleId();
    if (!instructorRoleId) {
      console.error("⚠️ No 'instructor' role found in roles table.");
      
      // Let's check what's in the user_roles table
      const userRolesDebug = await sql`
        SELECT ur.user_id, r.name as role_name, ur.is_primary
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        LIMIT 10
      `;
      console.log('🔍 Sample user_roles data:', userRolesDebug);
      
      return [];
    }

    console.log('🔍 Querying instructors with role_id:', instructorRoleId);

    // Check how many users have this role
    const roleCount = await sql`
      SELECT COUNT(*) as count
      FROM user_roles
      WHERE role_id = ${instructorRoleId}
    `;
    console.log(`📊 Users with instructor role: ${roleCount[0].count}`);

    const instructors = await sql`
      SELECT 
        u.id,
        u.name,
        u.bio,
        u.image,
        up.headline,
        up.website,
        up.linkedin_url,
        up.youtube_channel,
        up.skills,
        u.created_at,
        COUNT(DISTINCT c.id) AS total_courses,
        COALESCE(SUM(c.enrolled_students_count), 0) AS total_students,
        COALESCE(AVG(c.average_rating), 0) AS average_rating
      FROM users u
      INNER JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN courses c ON u.id = c.instructor_id AND c.is_published = true
      WHERE ur.role_id = ${instructorRoleId}
        AND u.is_active = true
      GROUP BY 
        u.id, u.name, u.bio, u.image,
        up.headline, up.website, 
        up.linkedin_url, up.youtube_channel, up.skills, 
        u.created_at
      ORDER BY total_courses DESC, u.name ASC
    `;

    console.log(`✅ Found ${instructors.length} instructors`);

    if (instructors.length === 0) {
      // Debug: Let's see what users exist
      const allUsers = await sql`
        SELECT u.id, u.name, u.email, r.name as role_name, ur.is_primary
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.is_active = true
        ORDER BY u.name
        LIMIT 20
      `;
      console.log('🔍 Sample active users with roles:', allUsers);
    }

    return instructors.map(instructor => ({
      id: instructor.id,
      name: instructor.name,
      bio: instructor.bio,
      image: instructor.image,
      headline: instructor.headline,
      website: instructor.website,
      linkedin_url: instructor.linkedin_url,
      youtube_channel: instructor.youtube_channel,
      skills: instructor.skills,
      created_at: instructor.created_at,
      total_courses: parseInt(instructor.total_courses) || 0,
      total_students: parseInt(instructor.total_students) || 0,
      average_rating: parseFloat(instructor.average_rating) || 0,
    }));
  } catch (error) {
    console.error('❌ Error fetching instructors:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error('Failed to fetch instructors');
  }
}

/**
 * Get single instructor with detailed information including their courses
 * FIXED: Better error handling
 */
export async function getInstructorById(
  instructorId: string
): Promise<InstructorWithCourses | null> {
  try {
    console.log('🔍 Fetching instructor by ID:', instructorId);
    
    const instructorRoleId = await getInstructorRoleId();
    if (!instructorRoleId) {
      console.error('❌ No instructor role found');
      return null;
    }

    const instructorData = await sql`
      SELECT 
        u.id,
        u.name,
        u.bio,
        u.image,
        up.headline,
        up.website,
        up.linkedin_url,
        up.youtube_channel,
        up.skills,
        u.created_at
      FROM users u
      INNER JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ${instructorId}
        AND ur.role_id = ${instructorRoleId}
        AND u.is_active = true
      LIMIT 1
    `;

    if (instructorData.length === 0) {
      console.warn(`⚠️ No instructor found with ID: ${instructorId}`);
      
      // Debug: Check if user exists and what role they have
      const userCheck = await sql`
        SELECT u.id, u.name, r.name as role_name
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ${instructorId}
      `;
      console.log('🔍 User check result:', userCheck);
      
      return null;
    }

    console.log('✅ Found instructor:', instructorData[0].name);

    const courses = await sql`
      SELECT 
        id,
        slug,
        title,
        thumbnail_url,
        enrolled_students_count,
        average_rating,
        difficulty_level
      FROM courses
      WHERE instructor_id = ${instructorId}
        AND is_published = true
      ORDER BY enrolled_students_count DESC, created_at DESC
    `;

    console.log(`📚 Found ${courses.length} courses for instructor`);

    const stats = await sql`
      SELECT 
        COUNT(DISTINCT c.id) AS total_courses,
        COALESCE(SUM(c.enrolled_students_count), 0) AS total_students,
        COALESCE(AVG(c.average_rating), 0) AS average_rating
      FROM courses c
      WHERE c.instructor_id = ${instructorId}
        AND c.is_published = true
    `;

    const instructor = instructorData[0];
    const s = stats[0];

    return {
      id: instructor.id,
      name: instructor.name,
      bio: instructor.bio,
      image: instructor.image,
      headline: instructor.headline,
      website: instructor.website,
      linkedin_url: instructor.linkedin_url,
      youtube_channel: instructor.youtube_channel,
      skills: instructor.skills,
      created_at: instructor.created_at,
      total_courses: parseInt(s.total_courses) || 0,
      total_students: parseInt(s.total_students) || 0,
      average_rating: parseFloat(s.average_rating) || 0,
      courses: courses.map(course => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnail_url: course.thumbnail_url,
        difficulty_level: course.difficulty_level,
        enrolled_students_count:
          parseInt(course.enrolled_students_count) || 0,
        average_rating: parseFloat(course.average_rating) || 0,
      })),
    };
  } catch (error) {
    console.error('❌ Error fetching instructor details:', error);
    throw new Error('Failed to fetch instructor details');
  }
}

/**
 * Get instructor statistics
 */
export async function getInstructorStats(instructorId: string) {
  try {
    const stats = await sql`
      SELECT 
        COUNT(DISTINCT c.id) AS total_courses,
        COALESCE(SUM(c.enrolled_students_count), 0) AS total_students,
        COALESCE(AVG(c.average_rating), 0) AS average_rating,
        COUNT(DISTINCT CASE WHEN c.is_featured = true THEN c.id END) AS featured_courses
      FROM courses c
      WHERE c.instructor_id = ${instructorId}
        AND c.is_published = true
    `;

    const s = stats[0];
    return {
      total_courses: parseInt(s.total_courses) || 0,
      total_students: parseInt(s.total_students) || 0,
      average_rating: parseFloat(s.average_rating) || 0,
      featured_courses: parseInt(s.featured_courses) || 0,
    };
  } catch (error) {
    console.error('❌ Error fetching instructor stats:', error);
    return {
      total_courses: 0,
      total_students: 0,
      average_rating: 0,
      featured_courses: 0,
    };
  }
}