// All node objects must have a unique value.
// This value is serialized into the checked and expanded arrays(props that are passed to tree creater) and
//is  also used for performance optimizations.
// other than value it can have label and children.

const nodes = [
  {
    value: "/app",
    label: "app",
    index:0,

    children: [
      {
        value: "/app/Http",
        label: "Http",
        children: [
          {
            value: "/app/Http/Controllers",
            label: "Controllers",
            children: [
              {
                value: "/app/Http/Controllers/WelcomeController.js",
                label: "WelcomeController.js",
              },
            ],
          },
          {
            value: "/app/Http/routes.js",
            label: "routes.js",
          },
        ],
      },
      {
        value: "/app/Providers",
        label: "Providers",
        children: [
          {
            value: "/app/Http/Providers/EventServiceProvider.js",
            label: "EventServiceProvider.js",
          },
        ],
      },
    ],
  },
  {
    value: "/config",
    label: "config",
    index:1,
    children: [
      {
        value: "/config/app.js",
        label: "app.js",
      },
      {
        value: "/config/database.js",
        label: "database.js",
      },
      {
        value: "/config/Rohit",
        label: "Rohit",
      },
    ],
  },
  {
    value: "/public",
    label: "public",
    index:2,
    children: [
      {
        value: "/public/assets/",
        label: "assets",
        children: [
          {
            value: "/public/assets/style.css",
            label: "style.css",
          },
        ],
      },
      {
        value: "/public/index.html",
        label: "index.html",
      },
    ],
  },
  {
    value: "/.env",
    label: ".env",
    index:3,
  },
  {
    value: "/.gitignore",
    label: ".gitignore",
    index:4,
  },
  {
    value: "/README.md",
    label: "README.md",
    index:5,
  },
];
export default nodes;
