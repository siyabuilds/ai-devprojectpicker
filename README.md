# AI Dev Project Picker 🚀

**Live Demo:** [https://ai-devprojectpicker.vercel.app/](https://ai-devprojectpicker.vercel.app/)

Welcome to the **AI Dev Project Picker**! This is a Next.js application designed to help developers figure out exactly which of their GitHub projects they should highlight for a specific job application. 

By simply entering your GitHub username and the job description you're applying for, this app fetches your recent repositories, analyzes them using OpenAI, and recommends the best portfolio pieces to showcase.

## ✨ Features
- **Automated Repository Fetching**: Pulls your latest open-source work directly from GitHub.
- **AI-Powered Match Analysis**: Reads through a target job description and finds the projects that fit best.
- **Slick, Modern UI**: Built with Next.js 16 (React 19), TailwindCSS v4, and smoothly animated with Framer Motion.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI/APIs**: OpenAI API, GitHub REST API

---

## 💻 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
You'll need Node.js installed on your machine and a couple of API keys:
1. **GitHub Personal Access Token**: Create one [here](https://github.com/settings/tokens) (no special scopes needed for public repos, but useful for avoiding rate limits).
2. **OpenAI API Key**: Grab one from the [OpenAI Platform](https://platform.openai.com/api-keys).

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/siyabuilds/ai-devprojectpicker.git
   cd ai-devprojectpicker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn / pnpm / bun
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GITHUB_API_KEY=your_github_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to check it out!

---

## 🎯 How to Use It

1. Load up the application.
2. Enter your **GitHub Username** in the designated input field.
3. Paste the **Job Description** of the role you're applying for.
4. Hit **Analyze**. The app will do the heavy lifting, comparing your repositories to the role's requirements, and present you with the best projects to feature on your application!

---

## 🚀 How to Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to your GitHub repository.
2. Sign in to Vercel and click **Add New...** -> **Project**.
3. Import this repository.
4. **Important**: In the configuration settings, add your Environment Variables (`GITHUB_API_KEY` and `OPENAI_API_KEY`).
5. Click **Deploy**. That's it! 

You can also deploy anywhere else that supports Next.js (Netlify, AWS Amplify, Docker, etc.). 

---

## 🤝 Contributing & Pull Requests

Have an idea to make this tool even better? Spotted a bug? **Pull Requests are more than welcome!** 

Whether it's a UI improvement, a more efficient AI prompt, or a brand new feature, I'd love to see what you come up with. 

**To contribute:**
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request!

If you're ever uncertain about a feature, feel free to open an Issue first to discuss it.

