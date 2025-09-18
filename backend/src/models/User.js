import { pool } from "../lib/db.js";

class User {
  // Create a new user
  static async create({ email, fullName, password, profilePic = '' }) {
    const query = `
      INSERT INTO users (email, full_name, password, profile_pic)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, profile_pic, created_at, updated_at
    `;
    const values = [email, fullName, password, profilePic];

    try {
      const result = await pool.query(query, values);
      return this.formatUser(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';

    try {
      const result = await pool.query(query, [email]);
      return result.rows.length > 0 ? this.formatUser(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.formatUser(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID without password
  static async findByIdWithoutPassword(id) {
    const query = 'SELECT id, email, full_name, profile_pic, created_at, updated_at FROM users WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.formatUser(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find all users except the given user ID
  static async findAllExcept(userId) {
    const query = 'SELECT id, email, full_name, profile_pic, created_at, updated_at FROM users WHERE id != $1';

    try {
      const result = await pool.query(query, [userId]);
      return result.rows.map(user => this.formatUser(user));
    } catch (error) {
      throw error;
    }
  }

  // Update user profile picture
  static async updateProfilePic(id, profilePic) {
    const query = `
      UPDATE users
      SET profile_pic = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, full_name, profile_pic, created_at, updated_at
    `;

    try {
      const result = await pool.query(query, [profilePic, id]);
      return result.rows.length > 0 ? this.formatUser(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Check if user exists
  static async exists(id) {
    const query = 'SELECT 1 FROM users WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Format user object to match frontend expectations
  static formatUser(user) {
    if (!user) return null;

    return {
      _id: user.id,
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      password: user.password,
      profilePic: user.profile_pic,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
}

export default User;
