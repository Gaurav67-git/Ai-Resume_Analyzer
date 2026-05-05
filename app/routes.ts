import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route('/auth','routes/auth.tsx'),
    route('/upload','routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/jobs/:id', 'routes/jobs.tsx'),
    route('/optimized-resume/:id', 'routes/optimized-resume.tsx'),
    route('/wipe','routes/wipe.tsx'),
] satisfies RouteConfig;
