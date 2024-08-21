/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: "/", destination: "/login", permanent: false }
        ]
    },
    reactStrictMode: false
};

export default nextConfig;
