# Multi Producer Graphing Application

Web app for plotting real time data from producer web sockets. Two plotting styles are available currently, with options on the home screen. Click and drag to zoom in and view statistics on graph subsections. Plots can be hidden and shown by clicking their name label in the graph legend.
React Router/uPlot FE, Tailwind for styling, Jest/RTL testing

- [React Router docs](https://reactrouter.com/)
- [uPlot React docs](https://github.com/leeoniya/uplot-react)
- [Tailwind docs](https://tailwindcss.com/)
- [Jest docs](https://jestjs.io/docs/getting-started)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Testing

To run jest tests, use

```bash
npm run test
```

### Code generator tools

Copilot was used to generate some unit tests and assist with styling on table and data point maximum component. It was also used for refactoring some graph code into components/utils, however it was not for core graph functionality.

### Troubleshooting

This was tested and should work with Node v22.12.0
