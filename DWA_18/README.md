# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



  // Helper function to format a date as a human-readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get the title of a genre based on its ID
  const getGenreTitle = (genreId) => {
    switch (genreId) {
      case 1:
        return "Personal Growth";
      case 2:
        return "True Crime and Investigative Journalism";
      case 3:
        return "History";
      case 4:
        return "Comedy";
      case 5:
        return "Entertainment";
      case 6:
        return "Business";
      case 7:
        return "Fiction";
      case 8:
        return "News";
      case 9:
        return "Kids and Family";
      default:
        return "Unknown Genre";
    }
  };
