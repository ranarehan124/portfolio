import type { Request, Response, NextFunction } from 'express';
import { AnalyticsModel, ProjectModel, SkillModel, ContactModel, ExperienceModel, ServiceModel, CertificateModel, EducationModel, TestimonialModel } from '../models/index.js';

export async function getDashboardStats(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalProjects,
      totalSkills,
      totalMessages,
      totalExperiences,
      totalServices,
      totalCertificates,
      totalEducation,
      totalTestimonials,
      recentMessages,
      unreadMessages,
    ] = await Promise.all([
      ProjectModel.countDocuments(),
      SkillModel.countDocuments(),
      ContactModel.countDocuments(),
      ExperienceModel.countDocuments(),
      ServiceModel.countDocuments({ isActive: true }),
      CertificateModel.countDocuments({ isActive: true }),
      EducationModel.countDocuments({ isActive: true }),
      TestimonialModel.countDocuments({ isActive: true }),
      ContactModel.find().sort({ createdAt: -1 }).limit(5).select('name email subject createdAt read'),
      ContactModel.countDocuments({ read: false }),
    ]);

    const recentMessagesLast30 = await ContactModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        totalSkills,
        totalMessages,
        totalExperiences,
        totalServices,
        totalCertificates,
        totalEducation,
        totalTestimonials,
        unreadMessages,
        recentMessages,
        recentMessagesLast30,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

    const dateFilter: Record<string, Date> = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    const query = Object.keys(dateFilter).length > 0
      ? AnalyticsModel.find({ date: dateFilter })
      : AnalyticsModel.find();

    const analytics = await query
      .sort({ date: -1 })
      .limit(parseInt(req.query.limit as string, 10) || 30);

    const totalStats = await AnalyticsModel.aggregate([
      ...(Object.keys(dateFilter).length > 0
        ? [{ $match: { date: dateFilter } }]
        : []),
      {
        $group: {
          _id: null,
          totalPageViews: { $sum: '$pageViews' },
          totalUniqueVisitors: { $sum: '$uniqueVisitors' },
          totalContactSubmissions: { $sum: '$contactSubmissions' },
          totalProjectClicks: { $sum: '$projectClicks' },
          days: { $sum: 1 },
        },
      },
    ]);

    const summary = totalStats[0]
      ? {
          totalPageViews: totalStats[0].totalPageViews,
          totalUniqueVisitors: totalStats[0].totalUniqueVisitors,
          totalContactSubmissions: totalStats[0].totalContactSubmissions,
          totalProjectClicks: totalStats[0].totalProjectClicks,
          averageDailyViews: Math.round(
            (totalStats[0].totalPageViews / (totalStats[0].days || 1)) * 100,
          ) / 100,
          daysTracked: totalStats[0].days,
        }
      : {
          totalPageViews: 0,
          totalUniqueVisitors: 0,
          totalContactSubmissions: 0,
          totalProjectClicks: 0,
          averageDailyViews: 0,
          daysTracked: 0,
        };

    res.json({
      success: true,
      data: {
        analytics,
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function upsertAnalytics(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { date, pageViews, uniqueVisitors, contactSubmissions, projectClicks, topPages, topReferrers } = req.body;

    if (!date) {
      res.status(400).json({ success: false, message: 'Date is required' });
      return;
    }

    const analytics = await AnalyticsModel.findOneAndUpdate(
      { date },
      {
        $set: {
          pageViews: pageViews ?? 0,
          uniqueVisitors: uniqueVisitors ?? 0,
          contactSubmissions: contactSubmissions ?? 0,
          projectClicks: projectClicks ?? 0,
          topPages: topPages ?? [],
          topReferrers: topReferrers ?? [],
        },
      },
      { new: true, upsert: true },
    );

    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
}