module.exports = (permission) => {
    return (req, res, next) => {
        let hasPermission;

        if (permission === 'view') {
            hasPermission = req.user.role === 'admin' || 'publisher';
        }

        if (permission === 'create') {
            hasPermission = req.user.role === 'admin';
        }

        if (permission === 'update') {
            hasPermission = req.user.role === 'admin';
        }

        if (permission === 'delete') {
            hasPermission = req.user.role === 'admin';
        }

        if (! hasPermission) {
            return res.status(401).json({
                message: 'This action is Un-Authorized'
            });
        }

        next();
    }
}