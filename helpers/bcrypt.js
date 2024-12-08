const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}
const comparePassword = (password, DB_password) => {
    return bcrypt.compareSync(password, DB_password)
}
module.exports = {hashPassword, comparePassword}