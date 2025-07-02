# PromptScroll 🚀

> Discover, rate and share the best AI prompts for ChatGPT, Claude, DALL-E and more.

PromptScroll is a community-driven platform for discovering, sharing, and rating high-quality AI prompts. Built with Vite, React, TypeScript, and Supabase.

## ✨ Features

*   **✍️ Create & Share Prompts:** Add your own prompts to the collection.
*   **⭐ Rate & Review:** Rate prompts based on their effectiveness with different AI models.
*   **🔍 Advanced Search & Filtering:** Easily find the prompts you're looking for.
*   **👤 User Profiles & Following:** Follow your favorite prompt creators.
*   **🔒 Authentication:** Secure user authentication powered by Supabase.

## 🏗️ Tech Stack

*   **Frontend:** Vite, React 18, TypeScript
*   **Styling:** Tailwind CSS
*   **Database & Auth:** Supabase (PostgreSQL)
*   **Forms:** React Hook Form with Zod for validation
*   **Routing:** React Router
*   **Testing:** Vitest, React Testing Library, Cypress
*   **Component Library:** Storybook

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   npm 8+
*   A Supabase account

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/promptscroll.git
    cd promptscroll
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Copy the example file and add your Supabase project credentials.
    ```bash
    cp .env.example .env.local
    ```
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Set up the database:**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   In the Supabase SQL Editor, run the migration files from the `supabase/migrations/` directory in chronological order.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Your local environment will be running at `http://localhost:5173`.

## 🔧 Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production.
*   `npm run preview`: Serves the production build locally.
*   `npm run test`: Runs unit tests with Vitest.
*   `npm run test:watch`: Runs unit tests in watch mode.
*   `npm run lint`: Lints the codebase with ESLint.
*   `npm run format`: Formats the code with Prettier.
*   `npm run storybook`: Starts the Storybook server.
*   `npm run build-storybook`: Builds the Storybook component library.
*   `npm run cy:open`: Opens the Cypress test runner.
*   `npm run cy:run`: Runs Cypress tests headlessly.

## 🤝 Contributing

Contributions are welcome! Please create a pull request with a clear description of your changes.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
