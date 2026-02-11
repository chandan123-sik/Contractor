import CMSContent from '../models/CMSContent.model.js';

// @desc    Get all CMS content
// @route   GET /api/admin/cms
// @access  Private
export const getAllCMSContent = async (req, res) => {
    try {
        const content = await CMSContent.find()
            .populate('updatedBy', 'name username');

        // Return as array for frontend compatibility
        const formattedContent = content.map(item => ({
            key: item.section,
            value: item.content,
            updatedBy: item.updatedBy,
            updatedAt: item.updatedAt
        }));

        res.status(200).json({
            success: true,
            data: { content: formattedContent }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching CMS content',
            error: error.message
        });
    }
};

// @desc    Get CMS content by section
// @route   GET /api/admin/cms/:section
// @access  Public
export const getCMSContentBySection = async (req, res) => {
    try {
        const { section } = req.params;

        const content = await CMSContent.findOne({ section });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Content section not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { content: content.content }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching CMS content',
            error: error.message
        });
    }
};

// @desc    Update CMS content
// @route   PUT /api/admin/cms
// @access  Private
export const updateCMSContent = async (req, res) => {
    try {
        const { aboutUs, contactUs, terms, privacy } = req.body;

        const updates = [];

        // Update About Us
        if (aboutUs) {
            const aboutUsContent = await CMSContent.findOneAndUpdate(
                { section: 'aboutUs' },
                { 
                    content: aboutUs,
                    updatedBy: req.admin._id
                },
                { new: true, upsert: true }
            );
            updates.push(aboutUsContent);
        }

        // Update Contact Us
        if (contactUs) {
            const contactUsContent = await CMSContent.findOneAndUpdate(
                { section: 'contactUs' },
                { 
                    content: contactUs,
                    updatedBy: req.admin._id
                },
                { new: true, upsert: true }
            );
            updates.push(contactUsContent);
        }

        // Update Terms
        if (terms) {
            const termsContent = await CMSContent.findOneAndUpdate(
                { section: 'terms' },
                { 
                    content: terms,
                    updatedBy: req.admin._id
                },
                { new: true, upsert: true }
            );
            updates.push(termsContent);
        }

        // Update Privacy
        if (privacy) {
            const privacyContent = await CMSContent.findOneAndUpdate(
                { section: 'privacy' },
                { 
                    content: privacy,
                    updatedBy: req.admin._id
                },
                { new: true, upsert: true }
            );
            updates.push(privacyContent);
        }

        res.status(200).json({
            success: true,
            message: 'CMS content updated successfully',
            data: { updates }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating CMS content',
            error: error.message
        });
    }
};

// @desc    Update specific CMS section
// @route   PUT /api/admin/cms/:section
// @access  Private
export const updateCMSSection = async (req, res) => {
    try {
        const { section } = req.params;
        const { content, value } = req.body;

        // Support both 'content' and 'value' parameters
        const contentToUpdate = content || value;

        if (!contentToUpdate) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const updatedContent = await CMSContent.findOneAndUpdate(
            { section },
            { 
                content: contentToUpdate,
                updatedBy: req.admin._id
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `${section} content updated successfully`,
            data: { content: updatedContent }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error updating CMS section',
            error: error.message
        });
    }
};
