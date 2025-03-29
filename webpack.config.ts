import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin"; // For CSS extraction
import TerserWebpackPlugin from "terser-webpack-plugin"; // For JS minification
import { DefinePlugin } from "webpack";
import WebpackPwaManifest from "webpack-pwa-manifest";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isProduction = process.argv.includes("build") || process.env.NODE_ENV === "production";

const config = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.ts", // Entry point for your application
  output: {
    path: path.resolve(__dirname, "build"), // Output directory
    filename: "static/js/[name].[contenthash].js", // Add content hashing for cache busting
    assetModuleFilename: "static/media/[name].[contenthash][ext]", // Output for assets
    publicPath: "/", // Ensure correct path resolution
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolve these extensions
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@assets": path.resolve(__dirname, "src/assets/"),
      "@lib": path.resolve(__dirname, "src/lib/"),
      "@hooks": path.resolve(__dirname, "src/hooks/"),
      "@store": path.resolve(__dirname, "src/store/"),
      "@actions": path.resolve(__dirname, "src/actions/"),
      "@routes": path.resolve(__dirname, "src/routes/"),
    },
  },
  devtool: isProduction ? "source-map" : "inline-source-map", // Source maps for debugging
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/, // For TypeScript files
        exclude: /node_modules/,
        use: "ts-loader",
        generator: {
          filename: "static/js/[name].[contenthash][ext]", // Output for assets
        },
      },
      {
        test: /\.js$/, // For JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Babel presets for React and modern JavaScript
          },
        },
      },
      {
        test: /\.css$/, // For CSS files
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader", // Extract CSS in production, use style-loader in development
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[contenthash][ext]", // Output for assets
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: "asset/inline",
        generator: {
          filename: "static/media/[name].[contenthash][ext]", // Output for assets
        },
      },
      {
        test: /\.(svg)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[contenthash][ext]", // Output for assets
        },
      },
      {
        test: /\.(mp4|webm|ogg|avi)$/i,
        type: "asset/resource", // Ensures video files are copied to the output folder
        generator: {
          filename: "static/media/[name].[contenthash][ext]", // Output for video files
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the output directory before each build
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Use your HTML file as a template
      inject: true,
      favicon: "./public/favicon.ico",
    }),
    new ForkTsCheckerWebpackPlugin(), // Run TypeScript checks in a separate thread
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash].css",
      }), // Extract CSS in production
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV === "production" ? "production" : "development"
      ),
    }),
    new WebpackPwaManifest({
      name: "Bookalooza",
      short_name: "Bookalooza",
      description:
        "Bookalooza - Empowering Students to Write and Publish Their Own book",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      icons: [
        {
          src: path.resolve("src/assets/icon.png"), // Path to your app icon
          sizes: [96, 128, 192, 256, 384, 512], // Sizes for the icon
        },
      ],
      publicPath: "/",
    }),
  ].filter(Boolean), // Filter out the plugin if not in production
  optimization: {
    splitChunks: {
      chunks: "all", // Enable code-splitting for all chunks
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    usedExports: true, // Enable tree-shaking
    minimize: isProduction, // Minimize for production
    minimizer: [
      new TerserWebpackPlugin(), // Minify JavaScript for production
    ],
  },
  devServer: {
    static: path.resolve(__dirname, "build"),
    compress: true, // Enable gzip compression
    port: 3000, // Dev server port
    historyApiFallback: {
      index: "/index.html", // Ensure fallback route points to the correct path
    }, // Handle routing for React
    open: true, // Automatically open the browser
    proxy: [
      {
        context: ['/designer'],
        target: 'http://localhost:80',
        // pathRewrite: { '^/designer': '' },
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/flipbook'],
        target: 'https://bookalooza.com',
        // pathRewrite: { '^/flipbook': '' },
        changeOrigin: true,
        secure: false,
      },
    ],
    allowedHosts: "all", // Allow all hosts for development
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    watchFiles: {
      paths: ["src/**/*"], // Watch changes in the 'src' folder (you can adjust this to fit your project structure)
      options: {
        usePolling: true, // Enable polling for file changes (useful for Docker and virtualized environments)
      },
    },
  },
};

export default config;
