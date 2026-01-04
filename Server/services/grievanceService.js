const db = require('../config/db');
const transporter = require('../config/mailer');

class GrievanceService {
    async submitGrievance(userId, userEmail, grievanceId, issueCategory, issueSubCategory, actionRequired, schoolName, labName, equipmentName, description, priority) {
        const query = `
            INSERT INTO grievances 
            (user_id, grievance_id, issue_category, issue_sub_category, action_required, school_name, lab_name, equipment_name, description, priority, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
        `;

        await db.promise().query(query, [
            userId,
            grievanceId,
            issueCategory,
            issueSubCategory,
            actionRequired,
            schoolName || null,
            labName || null,
            equipmentName || null,
            description,
            priority || 'Medium'
        ]);

        // Send email notification to admin
        await this.sendGrievanceNotification(userEmail, grievanceId, issueCategory, issueSubCategory, actionRequired, schoolName, labName, equipmentName, description, priority);
    }

    async sendGrievanceNotification(userEmail, grievanceId, issueCategory, issueSubCategory, actionRequired, schoolName, labName, equipmentName, description, priority) {
        const actionLabels = {
            'repair_replacement': '🔧 Repair / Replacement Required',
            'technical_support': '📞 Technical Support Call Required',
            'training': '🧑‍🏫 Training / Re-training Required',
            'documentation': '📄 Documentation / Manual Required',
            'vendor_intervention': '🏷 Vendor Intervention Required',
            'urgent_escalation': '🚨 Urgent Escalation'
        };

        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL;

        const mailOptions = {
            from: process.env.EMAIL,
            to: adminEmail,
            subject: `[SLATE Grievance] ${grievanceId} - ${issueCategory} - ${priority} Priority`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">New Grievance Submitted</h1>
                    </div>
                    <div style="padding: 24px; background: #f9fafb;">
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <div style="background: #dbeafe; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
                                <strong style="color: #1e40af;">Grievance ID:</strong> 
                                <span style="color: #3b82f6; font-size: 18px; font-weight: bold;">${grievanceId}</span>
                            </div>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 40%;">Submitted By:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${userEmail}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Issue Category:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${issueCategory}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Sub-Category:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${issueSubCategory}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Action Required:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${actionLabels[actionRequired] || actionRequired}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Priority:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="background: ${priority === 'Critical' ? '#dc2626' : priority === 'High' ? '#f87171' : priority === 'Medium' ? '#fbbf24' : '#60a5fa'}; color: ${priority === 'Critical' || priority === 'High' ? 'white' : '#1f2937'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                            ${priority}
                                        </span>
                                    </td>
                                </tr>
                                ${schoolName ? `
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">School:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${schoolName}</td>
                                </tr>
                                ` : ''}
                                ${labName ? `
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Lab:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${labName}</td>
                                </tr>
                                ` : ''}
                                ${equipmentName ? `
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Equipment:</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${equipmentName}</td>
                                </tr>
                                ` : ''}
                            </table>
                            
                            <div style="margin-top: 20px;">
                                <strong style="color: #374151;">Description:</strong>
                                <p style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 8px 0 0 0; color: #4b5563; line-height: 1.6;">
                                    ${description}
                                </p>
                            </div>
                        </div>
                        
                        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
                            This is an automated notification from SLATE Grievance Portal.
                        </p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Grievance notification email sent successfully');
        } catch (error) {
            console.error('Error sending grievance notification email:', error);
            // Don't throw error - grievance should still be saved even if email fails
        }
    }

    async getMyGrievances(userId) {
        const query = `
            SELECT * FROM grievances 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `;
        const [results] = await db.promise().query(query, [userId]);
        return results;
    }

    async getAllGrievances() {
        const query = `
            SELECT g.*, u.username, u.email 
            FROM grievances g
            LEFT JOIN users u ON g.user_id = u.id
            ORDER BY g.created_at DESC
        `;
        const [results] = await db.promise().query(query);
        return results;
    }

    async updateGrievanceStatus(grievanceId, status, remarks, updatedBy) {
        const query = `
            UPDATE grievances 
            SET status = ?, remarks = ?, updated_by = ?, updated_at = NOW()
            WHERE id = ?
        `;
        await db.promise().query(query, [status, remarks, updatedBy, grievanceId]);
    }
}

module.exports = new GrievanceService();
