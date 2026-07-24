import { Router } from 'express';
import * as authCtrl from '../controllers/authController.js';
import * as projectCtrl from '../controllers/projectController.js';
import * as skillCtrl from '../controllers/skillController.js';
import * as expCtrl from '../controllers/experienceController.js';
import * as contactCtrl from '../controllers/contactController.js';
import * as heroCtrl from '../controllers/heroController.js';
import * as socialCtrl from '../controllers/socialController.js';
import * as uploadCtrl from '../controllers/uploadController.js';
import * as serviceCtrl from '../controllers/serviceController.js';
import * as certCtrl from '../controllers/certificateController.js';
import * as testimonialCtrl from '../controllers/testimonialController.js';
import * as eduCtrl from '../controllers/educationController.js';
import * as aboutCtrl from '../controllers/aboutController.js';
import * as settingsCtrl from '../controllers/settingsController.js';
import * as analyticsCtrl from '../controllers/analyticsController.js';
import {
  requireAuth,
  requireRoles,
  uploadImage,
  uploadImages,
  uploadResume,
  authLimiter,
  contactLimiter,
} from '../middleware/index.js';
import {
  loginValidator,
  createProjectValidator,
  updateProjectValidator,
  createSkillValidator,
  createExperienceValidator,
  contactValidator,
  socialValidator,
  createServiceValidator,
  updateServiceValidator,
  createCertificateValidator,
  updateCertificateValidator,
  createTestimonialValidator,
  updateTestimonialValidator,
  createEducationValidator,
  updateEducationValidator,
  updateAboutValidator,
  updateSettingsValidator,
  updateSeoValidator,
  validateRequest,
} from '../validators/index.js';

const router = Router();

// ══════════════════════════════════════════
// Health Check
// ══════════════════════════════════════════

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Rehan Tahir Portfolio API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ══════════════════════════════════════════
// Auth — /api/v1/auth
// ══════════════════════════════════════════

router.post(
  '/auth/login',
  authLimiter,
  loginValidator,
  validateRequest,
  authCtrl.login,
);
router.post('/auth/refresh-token', authCtrl.refreshToken);
router.get('/auth/validate', requireAuth, authCtrl.validateToken);
router.get('/auth/me', requireAuth, authCtrl.getMe);
router.put('/auth/profile', requireAuth, authCtrl.updateProfile);
router.put(
  '/auth/change-password',
  requireAuth,
  authCtrl.changePassword,
);
router.post('/auth/logout', authCtrl.logout);

// ══════════════════════════════════════════
// Public Content — /api/v1
// ══════════════════════════════════════════

// Hero (singleton)
router.get('/hero', heroCtrl.getHero);

// About (singleton)
router.get('/about', aboutCtrl.getAbout);

// Projects (public: featured only, paginated)
router.get('/projects', projectCtrl.getProjects);
router.get('/projects/:id', projectCtrl.getProjectById);

// Skills (public: featured only, paginated)
router.get('/skills', skillCtrl.getSkills);

// Experience (paginated)
router.get('/experience', expCtrl.getExperiences);
router.get('/experience/:id', expCtrl.getExperienceById);

// Services (public: active only, paginated)
router.get('/services', serviceCtrl.getServices);
router.get('/services/:id', serviceCtrl.getServiceById);

// Certificates (public: active only, paginated)
router.get('/certificates', certCtrl.getCertificates);
router.get('/certificates/:id', certCtrl.getCertificateById);

// Testimonials (public: active only, paginated)
router.get('/testimonials', testimonialCtrl.getTestimonials);
router.get('/testimonials/:id', testimonialCtrl.getTestimonialById);

// Education (public: active only, paginated)
router.get('/education', eduCtrl.getEducation);
router.get('/education/:id', eduCtrl.getEducationById);

// Social Links
router.get('/socials', socialCtrl.getSocials);

// Contact (form submission)
router.post(
  '/contact',
  contactLimiter,
  contactValidator,
  validateRequest,
  contactCtrl.submitContact,
);

// Settings (public read)
router.get('/settings', settingsCtrl.getSettings);
router.get('/seo', settingsCtrl.getSeo);

// Upload (public single image)
router.post(
  '/upload',
  uploadImage.single('image'),
  uploadCtrl.uploadSingleImage,
);

// ══════════════════════════════════════════
// Admin — /api/v1/admin
// ══════════════════════════════════════════

// Dashboard & Analytics
router.get(
  '/admin/dashboard',
  requireAuth,
  analyticsCtrl.getDashboardStats,
);
router.get(
  '/admin/analytics',
  requireAuth,
  analyticsCtrl.getAnalytics,
);
router.post(
  '/admin/analytics',
  requireAuth,
  requireRoles('superadmin'),
  analyticsCtrl.upsertAnalytics,
);

// Projects CRUD (admin: all projects, paginated + search + filter)
router.post(
  '/admin/projects',
  requireAuth,
  createProjectValidator,
  validateRequest,
  projectCtrl.createProject,
);
router.get('/admin/projects', requireAuth, projectCtrl.getAllProjects);
router.put(
  '/admin/projects/:id',
  requireAuth,
  updateProjectValidator,
  validateRequest,
  projectCtrl.updateProject,
);
router.delete(
  '/admin/projects/:id',
  requireAuth,
  projectCtrl.deleteProject,
);
router.post(
  '/admin/projects/bulk-delete',
  requireAuth,
  requireRoles('superadmin'),
  projectCtrl.bulkDeleteProjects,
);

// Skills CRUD (admin: all skills, paginated + search + filter)
router.post(
  '/admin/skills',
  requireAuth,
  createSkillValidator,
  validateRequest,
  skillCtrl.createSkill,
);
router.get('/admin/skills', requireAuth, skillCtrl.getAllSkills);
router.put('/admin/skills/:id', requireAuth, skillCtrl.updateSkill);
router.delete('/admin/skills/:id', requireAuth, skillCtrl.deleteSkill);
router.post(
  '/admin/skills/bulk-delete',
  requireAuth,
  requireRoles('superadmin'),
  skillCtrl.bulkDeleteSkills,
);

// Experience CRUD
router.post(
  '/admin/experience',
  requireAuth,
  createExperienceValidator,
  validateRequest,
  expCtrl.createExperience,
);
router.put(
  '/admin/experience/:id',
  requireAuth,
  expCtrl.updateExperience,
);
router.delete(
  '/admin/experience/:id',
  requireAuth,
  expCtrl.deleteExperience,
);

// Services CRUD
router.post(
  '/admin/services',
  requireAuth,
  createServiceValidator,
  validateRequest,
  serviceCtrl.createService,
);
router.put(
  '/admin/services/:id',
  requireAuth,
  updateServiceValidator,
  validateRequest,
  serviceCtrl.updateService,
);
router.delete(
  '/admin/services/:id',
  requireAuth,
  serviceCtrl.deleteService,
);

// Certificates CRUD
router.post(
  '/admin/certificates',
  requireAuth,
  createCertificateValidator,
  validateRequest,
  certCtrl.createCertificate,
);
router.put(
  '/admin/certificates/:id',
  requireAuth,
  updateCertificateValidator,
  validateRequest,
  certCtrl.updateCertificate,
);
router.delete(
  '/admin/certificates/:id',
  requireAuth,
  certCtrl.deleteCertificate,
);

// Testimonials CRUD
router.post(
  '/admin/testimonials',
  requireAuth,
  createTestimonialValidator,
  validateRequest,
  testimonialCtrl.createTestimonial,
);
router.put(
  '/admin/testimonials/:id',
  requireAuth,
  updateTestimonialValidator,
  validateRequest,
  testimonialCtrl.updateTestimonial,
);
router.delete(
  '/admin/testimonials/:id',
  requireAuth,
  testimonialCtrl.deleteTestimonial,
);

// Education CRUD
router.post(
  '/admin/education',
  requireAuth,
  createEducationValidator,
  validateRequest,
  eduCtrl.createEducation,
);
router.put(
  '/admin/education/:id',
  requireAuth,
  updateEducationValidator,
  validateRequest,
  eduCtrl.updateEducation,
);
router.delete(
  '/admin/education/:id',
  requireAuth,
  eduCtrl.deleteEducation,
);

// Hero (singleton update)
router.put('/admin/hero', requireAuth, heroCtrl.updateHero);

// About (singleton update)
router.put(
  '/admin/about',
  requireAuth,
  updateAboutValidator,
  validateRequest,
  aboutCtrl.updateAbout,
);

// Social Links CRUD
router.post(
  '/admin/socials',
  requireAuth,
  socialValidator,
  validateRequest,
  socialCtrl.createSocial,
);
router.put(
  '/admin/socials/:id',
  requireAuth,
  socialCtrl.updateSocial,
);
router.put(
  '/admin/socials/platform/:platform',
  requireAuth,
  socialCtrl.upsertSocial,
);
router.delete('/admin/socials/:id', requireAuth, socialCtrl.deleteSocial);

// Contact Messages (admin)
router.get('/admin/messages', requireAuth, contactCtrl.getMessages);
router.get(
  '/admin/messages/:id',
  requireAuth,
  contactCtrl.getMessageById,
);
router.put(
  '/admin/messages/:id/read',
  requireAuth,
  contactCtrl.markMessageAsRead,
);
router.put(
  '/admin/messages/:id/unread',
  requireAuth,
  contactCtrl.markMessageAsUnread,
);
router.delete(
  '/admin/messages/:id',
  requireAuth,
  contactCtrl.deleteMessage,
);
router.post(
  '/admin/messages/bulk-delete',
  requireAuth,
  requireRoles('superadmin'),
  contactCtrl.bulkDeleteMessages,
);

// Upload (admin: multiple images + delete)
router.post(
  '/admin/upload/multiple',
  requireAuth,
  uploadImages.array('images', 10),
  uploadCtrl.uploadMultiple,
);
router.delete('/admin/upload', requireAuth, uploadCtrl.removeImage);

// Resume Upload
router.post(
  '/admin/resume',
  requireAuth,
  uploadResume.single('resume'),
  (req, res) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    res.json({
      success: true,
      data: { url: `/uploads/resumes/${req.file.filename}` },
    });
  },
);

// Settings (admin)
router.put(
  '/admin/settings',
  requireAuth,
  requireRoles('superadmin'),
  updateSettingsValidator,
  validateRequest,
  settingsCtrl.updateSettings,
);
router.put(
  '/admin/seo',
  requireAuth,
  requireRoles('superadmin'),
  updateSeoValidator,
  validateRequest,
  settingsCtrl.updateSeo,
);

export default router;