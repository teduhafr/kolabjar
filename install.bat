@echo off
REM Copy example.env to .env if it doesn’t already exist
if not exist .env (
    copy example.env .env
)

REM Install Node.js dependencies
npm install
