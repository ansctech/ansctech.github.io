const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

const pool = require("../../db");
const {
  generateInsertQuery,
  generateUpdateQuery,
  generateRetrieveQuery,
  generateDeleteQuery,
} = require("../utils/general");

const tableName = "client_master";
const clauseKey = "clientid";

// Create json token for user
const signToken = (clientId) => {
  return jwt.sign({ clientId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create token to cookie
const assignTokenToCookie = async (res, user, statusCode) => {
  // Create token
  const token = signToken(user.client_id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  };

  // Save token as cookie
  res.cookie("agroToken", token, cookieOptions);

  // Get client account
  pool.query(
    generateRetrieveQuery(tableName, clauseKey, user.client_id),
    (err, results) => {
      if (err) console.log(err);
      let noItemFound = !results.rows.length;
      if (noItemFound) {
        return res.status(404).json({
          message: "Client account not found",
        });
      }

      return res.status(statusCode).json({
        status: "success",
        data: {
          user: results.rows[0],
        },
      });
    }
  );
};

// Login route
exports.login = (req, res) => {
  const tableName = "client_user";
  const clauseKey = "user_name";

  // Get inputted values
  const { email, password } = req.body;

  // Get user details
  pool.query(
    generateRetrieveQuery(tableName, clauseKey, `'${email}'`),
    (err, results) => {
      if (err) {
        console.log(err);
      }
      let noItemFound = !results.rows.length;
      if (noItemFound) {
        return res.status(404).json({
          message: "Email or Password Incorrect",
        });
      }

      const user = results.rows[0];
      if (user.password !== password) {
        return res.status(404).json({
          message: "Email or Password Incorrect",
        });
      }

      assignTokenToCookie(res, user, 200);
    }
  );
};

exports.logout = (req, res) => {
  res.cookie("agroToken", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 10000),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out",
  });
};

exports.signup = (req, res) => {
  const {
    client_name_eng,
    client_name_local_lang,
    default_lang,
    logo,
    tagline,
    header_mark,
    address,
    city,
    state,
    phone,
    email,
  } = req.body;

  // Add user to database

  //
};

exports.protect = async (req, res, next) => {
  let token = req.cookies.agroToken;

  //   Check if user is logged in
  if (!token) return res.status(403).json({ message: "You are not logged in" });

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Get user details
  pool.query(
    generateRetrieveQuery(tableName, clauseKey, decodedToken.clientId),
    (err, results) => {
      if (err) console.log(err);
      let noItemFound = !results.rows.length;
      if (noItemFound) {
        return res.status(404).json({
          message: "Client account not found",
        });
      }

      req.user = results.rows[0];

      // Only check for this when user makes post/put request to database
      if (req.method === "POST" || req.method === "PUT") {
        // Check for user subscription last date
        const currentDateString = Date.now();
        const subscriptionEndsDateString = new Date(
          req.user.subscription_last_date
        ).getTime();

        // If subscription date end is passed, i.e less than the current time
        if (subscriptionEndsDateString < currentDateString) {
          return res.status(402).json({
            status: "error",
            message: "Your subscription has expired, Kindly renew it.",
          });
        }
      }

      next();
    }
  );
};
