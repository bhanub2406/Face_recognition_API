const handleGetProfile = (req, res, db) => {
    const { id } = req.params;
    db('users')
    .where({
        id: id
    })
    .select('*')
    .then(user => {
        if(user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('user not found');
        }
    })
    .catch(err => res.status(404).json('Error finding user'));
}

module.exports = {
    handleGetProfile: handleGetProfile
}