# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon key

### 3. Create Environment File
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Troubleshooting

### Common Issues

**"Supabase client not found"**
- Check your `.env.local` file exists
- Verify environment variable names are correct
- Restart the development server

**"Authentication not working"**
- Ensure Supabase project is active
- Check if email confirmations are enabled/disabled as needed
- Verify your Supabase project URL is correct

**"Build errors"**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 📱 Testing Mobile

### Browser DevTools
1. Open DevTools (F12)
2. Click device toggle button
3. Select mobile device (iPhone, Android)
4. Test touch interactions and responsive design

### Real Device Testing
1. Ensure your computer and phone are on same network
2. Find your computer's IP address
3. Run: `npm run dev -- --hostname 0.0.0.0`
4. Access from phone: `http://YOUR_IP:3000`

## 🚀 Next Steps

1. **Customize Dashboard**: Modify components in `src/components/dashboard/`
2. **Add Features**: Create new components in `src/components/`
3. **Style Changes**: Modify Tailwind classes or add custom CSS
4. **Database**: Create tables in Supabase dashboard
5. **Deploy**: Push to GitHub and connect to Vercel

## 📚 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [PROJECT_PLAN.md](PROJECT_PLAN.md) for development guidelines
- Create GitHub issues for bugs or questions
- Check Supabase documentation for backend questions

---

**Happy coding! 🎉**
