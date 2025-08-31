# Renosteps V2 - Personal Dashboard

A modern, responsive web application built with Next.js, featuring Supabase authentication and a personal dashboard. Designed with mobile-first approach and optimized for both desktop and mobile devices.

## 🚀 Features

- **Authentication System**: Complete login/registration with Supabase
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Personal Dashboard**: User-specific dashboard with statistics and quick actions
- **Modern UI/UX**: Clean, intuitive interface with smooth transitions
- **TypeScript**: Full type safety and better development experience
- **Real-time Updates**: Live authentication state management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Deployment**: Vercel (planned)
- **Mobile**: iOS WebView App (planned)

## 📱 Mobile & Desktop Focus

- **Mobile-First Design**: Responsive layout that works on all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Progressive Web App**: Ready for mobile app store deployment
- **Cross-Platform**: Works seamlessly on iOS, Android, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd renosteps-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Get Supabase credentials**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project or use existing one
   - Go to Settings > API
   - Copy the Project URL and anon/public key

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Supabase Configuration

1. **Enable Authentication**
   - Go to Authentication > Settings in Supabase
   - Enable Email confirmations (optional)
   - Configure password policies

2. **Create Tables** (if needed)
   ```sql
   -- Example user profile table
   CREATE TABLE user_profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Set up Row Level Security (RLS)**
   ```sql
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = id);
   ```

## 📱 Mobile App Development

### iOS WebView App

The web application is designed to be wrapped in an iOS WebView for App Store deployment:

- **WebView Integration**: Native iOS app with embedded web content
- **App Store Compliance**: Follows Apple's guidelines for WebView apps
- **Offline Support**: Service worker implementation for offline functionality
- **Push Notifications**: Web-based push notifications (future enhancement)

### Development Guidelines

- **Touch Targets**: Minimum 44x44 points for iOS
- **Swipe Gestures**: Implement native-like swipe interactions
- **Performance**: Optimize for mobile network conditions
- **Accessibility**: Follow WCAG guidelines for mobile

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Custom Domain** (optional)
   - Add your custom domain in Vercel
   - Configure DNS settings

### Environment Variables in Vercel

Add these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📋 Development Rules & Guidelines

### Code Quality

- **TypeScript**: Use strict mode, no `any` types
- **ESLint**: Follow Next.js recommended rules
- **Prettier**: Consistent code formatting
- **Component Structure**: One component per file, clear naming

### Performance

- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Implement dynamic imports for large components
- **Bundle Size**: Keep dependencies minimal
- **Lazy Loading**: Implement for non-critical components

### Mobile Optimization

- **Responsive Design**: Test on multiple screen sizes
- **Touch Interactions**: Optimize for mobile gestures
- **Loading States**: Provide clear feedback for user actions
- **Offline Support**: Graceful degradation when offline

### Security

- **Environment Variables**: Never commit sensitive data
- **Input Validation**: Validate all user inputs
- **Authentication**: Implement proper session management
- **HTTPS**: Always use secure connections in production

## 🎯 Project Roadmap

### Phase 1: Core Authentication ✅
- [x] Supabase integration
- [x] Login/Registration forms
- [x] User authentication flow
- [x] Basic dashboard

### Phase 2: Enhanced Dashboard 🚧
- [ ] User profile management
- [ ] Data visualization components
- [ ] Settings and preferences
- [ ] Notification system

### Phase 3: Mobile App 📱
- [ ] iOS WebView app
- [ ] App Store submission
- [ ] Push notifications
- [ ] Offline functionality

### Phase 4: Advanced Features 🚀
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] API integrations
- [ ] Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
