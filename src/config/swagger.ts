import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Music API",
      version: "1.0.0",
      description:
        "A RESTful API for a music streaming service, built with Node.js, Express, MongoDB and Cloudinary",
      contact: {
        name: "Music API Support",
      },
    },
    servers: [
      {
        url: "https://music-api-five-omega.vercel.app",
        description: "Production server",
      },
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            profilePicture: {
              type: "string",
              format: "uri",
              description: "URL to user's profile picture",
            },
            isAdmin: {
              type: "boolean",
              description: "Whether user has admin privileges",
              default: false,
            },
            likedSongs: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of liked song IDs",
            },
            likedAlbums: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of liked album IDs",
            },
            followedArtists: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of followed artist IDs",
            },
            followedPlaylists: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of followed playlist IDs",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Artist: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Artist ID",
            },
            name: {
              type: "string",
              description: "Artist name",
            },
            bio: {
              type: "string",
              description: "Artist biography",
            },
            image: {
              type: "string",
              format: "uri",
              description: "URL to artist image",
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of genre tags",
            },
            followers: {
              type: "number",
              description: "Number of followers",
              default: 0,
            },
            albums: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of album IDs",
            },
            isVerified: {
              type: "boolean",
              description: "Whether artist is verified",
              default: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Album: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Album ID",
            },
            title: {
              type: "string",
              description: "Album title",
            },
            description: {
              type: "string",
              description: "Album description",
            },
            artist: {
              type: "string",
              description: "Artist ID",
            },
            releaseDate: {
              type: "string",
              format: "date-time",
              description: "Release date",
            },
            coverImage: {
              type: "string",
              format: "uri",
              description: "URL to album cover image",
            },
            songs: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of song IDs",
            },
            genre: {
              type: "string",
              description: "Album genre",
            },
            likes: {
              type: "number",
              description: "Number of likes",
              default: 0,
            },
            isExplicit: {
              type: "boolean",
              description: "Whether album contains explicit content",
              default: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Song: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Song ID",
            },
            title: {
              type: "string",
              description: "Song title",
            },
            artist: {
              type: "string",
              description: "Artist ID",
            },
            album: {
              type: "string",
              description: "Album ID",
            },
            duration: {
              type: "number",
              description: "Duration in seconds",
            },
            audioUrl: {
              type: "string",
              format: "uri",
              description: "URL to audio file",
            },
            coverImage: {
              type: "string",
              format: "uri",
              description: "URL to cover image",
            },
            releaseDate: {
              type: "string",
              format: "date-time",
              description: "Release date",
            },
            genre: {
              type: "string",
              description: "Song genre",
            },
            plays: {
              type: "number",
              description: "Number of plays",
              default: 0,
            },
            likes: {
              type: "number",
              description: "Number of likes",
              default: 0,
            },
            isExplicit: {
              type: "boolean",
              description: "Whether song contains explicit content",
              default: false,
            },
            featuredArtists: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of featured artist IDs",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            status: {
              type: "string",
              description: "Error status",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
              minLength: 6,
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              description: "User's name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
              minLength: 6,
            },
            isAdmin: {
              type: "boolean",
              description: "Whether user has admin privileges",
              default: false,
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/routes/*.ts", // Path to the API routes
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
