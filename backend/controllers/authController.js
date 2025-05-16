
const User = require('../models/User');
const userFactory = require('../factories/userFactory')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const RoleStrategyContext = require('../strategies/userFilterStartegy');
const Notification = require('../models/Notification');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateRandomPassword = (length = 12) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role, dateOfBirth } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await userFactory.createUser({ firstName, lastName, email, password, role, dateOfBirth });
        res.status(201).json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            read: false,
        });

        res.status(200).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role, 
            dateOfBirth: user.dateOfBirth,
            unreadCount: unreadCount,
            token: generateToken(user.id),
        });

        if (user.role === 'Teacher') {
            profileData.description = user.description || '';
        } else if (user.role === 'Student') {
            profileData.major = user.major || '';
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { firstName, lastName, dateOfBirth, description, major } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        if (dateOfBirth === '') {
            user.dateOfBirth = null;
        } else if (dateOfBirth) {
            user.dateOfBirth = new Date(dateOfBirth);
        }

        if (user.role === 'Teacher') {
            user.description = description || '';
        } else if (user.role === 'Student') {
            user.major = major || '';
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const roleContext = new RoleStrategyContext(req.user);
        const baseFilter = roleContext.getFilter();

        const { role } = req.query;
    
        let finalFilter = baseFilter;
    
        if (role) {
            finalFilter = { $and: [baseFilter, { role }] };
        }
        const users = await User.find(finalFilter);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const roleContext = new RoleStrategyContext(req.user);  // Pass user to context
        const filter = roleContext.getFilter();  // Get filter based on role

        const user = await User.findOne({ _id: req.params.id, ...filter });
        if (!user) return res.status(404).json({ message: 'User not found or not allowed' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addUser = async (req, res) => {
    const { firstName, lastName, email, role, dateOfBirth } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        const password = generateRandomPassword();
        const newUser = await userFactory.createUser({ firstName, lastName, email, password, role, dateOfBirth });
        // Should not actually send password in real system, use mail instead
        res.status(201).json({
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                dateOfBirth: newUser.dateOfBirth,
            },
            password: password
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { firstName, lastName, role, dateOfBirth } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.role = role || user.role;

        if (dateOfBirth === '') {
            user.dateOfBirth = null;
        } else if (dateOfBirth) {
            user.dateOfBirth = new Date(dateOfBirth);
        }

        if (user.role === 'Teacher') {
            user.description = description || '';
        } else if (user.role === 'Student') {
            user.major = major || '';
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.remove();
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    getNotifications,
    markAllNotificationsRead
};
