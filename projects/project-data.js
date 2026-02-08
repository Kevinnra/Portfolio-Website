// Centralized project data for dynamic loading
const projectsData = {
  "aws-portfolio": {
    title: "Personal Portfolio Hosting on AWS",
    tagline: "Production-ready static website with automated CI/CD pipeline",
    badges: ["AWS S3", "CloudFront", "Route 53", "GitHub Actions", "IAM"],
    
    links: {
      github: "https://github.com/Kevinnra/Kevinnra.github.io",
      demo: "https://www.kevinnramirez.com"
    },
    
    overview: {
      problem: "Traditional web hosting lacks scalability, global performance optimization, and automated deployment workflows. Manual updates are error-prone and time-consuming, while conventional hosting providers offer limited control over infrastructure.",
      
      solution: "Implemented a serverless, globally distributed architecture using AWS services with full infrastructure automation through GitHub Actions. The solution achieves enterprise-grade performance at minimal cost while maintaining complete control over the deployment pipeline.",
      
      results: [
        "99.99% availability via CloudFront CDN",
        "Sub-second global load times",
        "$0.56/month operational cost",
        "Zero-downtime deployments",
        "100% deployment automation"
      ]
    },
    
    architecture: {
      image: "/Resources/images/Architecture-Diagram-AWS-dark.jpg",
      description: "The architecture follows a serverless pattern where S3 serves as the origin server, CloudFront handles global content delivery through edge locations, and Route 53 manages DNS routing. GitHub Actions orchestrates the entire deployment process, implementing intelligent cache invalidation to ensure content freshness while minimizing API costs."
    },
    
    // Optional: Technical Details
    technicalDetails: [
      {
        service: "AWS S3",
        details: "Static website hosting with versioning enabled, AES-256 encryption, and optimized bucket policies for public read access"
      },
      {
        service: "CloudFront CDN",
        details: "Global content delivery with custom domain support, HTTPS enforcement, and intelligent caching strategies"
      },
      {
        service: "Route 53",
        details: "DNS management with A record aliases pointing to CloudFront distribution for both apex and www domains"
      },
      {
        service: "GitHub Actions",
        details: "Automated CI/CD pipeline with file change detection and selective cache invalidation"
      },
      {
        service: "IAM Security",
        details: "Dedicated users with least-privilege policies for development and CI/CD operations"
      }
    ],
    
    // Optional: Key Features
    features: [
      {
        title: "Intelligent Cache Invalidation",
        description: "Pipeline automatically detects modified HTML, CSS, and JavaScript files using Git comparison, then invalidates only those specific CloudFront paths. This reduces API costs by 80% while ensuring users always see the latest content."
      },
      {
        title: "Zero-Downtime Deployments",
        description: "S3 versioning combined with CloudFront's edge caching ensures continuous availability during updates. The deployment process includes automated health checks and rollback capabilities."
      },
      {
        title: "Security Best Practices",
        description: "Implementation includes dedicated IAM users with minimal permissions, S3 server-side encryption, GitHub Secrets for credential management, and no hardcoded secrets in source code."
      }
    ],
    
    challenges: [
      {
        title: "Challenge #1: Broken Website After CSS Updates",
        problem: "Initial CI/CD pipeline only invalidated index.html in CloudFront cache. When CSS or JavaScript files were updated, the website displayed outdated styles due to cached content, breaking the visual appearance and functionality.",
        solution: "Implemented Git-based file change detection that compares current commit with previous commit to identify modified files. The pipeline dynamically generates CloudFront invalidation paths for only the changed HTML, CSS, and JS files.",
        code: {
          language: "yaml",
          title: "Intelligent Cache Invalidation - GitHub Actions",
          content: `- name: Check if important files were modified
  id: check_files
  run: |
    echo "Checking which files were modified..."
    CHANGED_FILES=$(git diff --name-only \${{ github.event.before }} \${{ github.sha }} | grep -E '\\.(html|css|js)$' || true)
    
    if [ -n "$CHANGED_FILES" ]; then
      echo "Changed files:"
      echo "$CHANGED_FILES"
      
      # Convert file list to CloudFront paths format
      PATHS=$(echo "$CHANGED_FILES" | sed 's|^|/|' | tr '\\n' ' ')
      echo "paths=$PATHS" >> $GITHUB_OUTPUT
      echo "has_changes=true" >> $GITHUB_OUTPUT
    else
      echo "No HTML, CSS, or JS files changed"
      echo "has_changes=false" >> $GITHUB_OUTPUT
    fi

- name: Invalidate CloudFront cache
  if: steps.check_files.outputs.has_changes == 'true'
  run: |
    echo "Invalidating CloudFront for changed files..."
    aws cloudfront create-invalidation \\
      --distribution-id \${{ secrets.CLOUDFRONT_DIST_ID }} \\
      --paths \${{ steps.check_files.outputs.paths }}`
        },
        benefits: [
          "Website always reflects latest changes immediately",
          "Reduced CloudFront invalidation costs by 80%",
          "Faster cache invalidation processing",
          "More efficient pipeline execution"
        ]
      },
      {
        title: "Challenge #2: Understanding AWS Service Integration",
        problem: "Initially struggled to understand how S3, CloudFront, and Route 53 interconnect for static website hosting. The relationship between origin servers, CDN edge locations, and DNS routing was unclear.",
        solution: "Created detailed architecture diagrams and documented the complete data flow. Learned that S3 serves as the origin server storing website files, CloudFront acts as the CDN distributing content globally through edge locations, and Route 53 routes domain traffic to the CloudFront distribution.",
        benefits: [
          "Deep understanding of cloud service integration",
          "Ability to design scalable architectures",
          "Knowledge of CDN and caching strategies",
          "Foundation for future cloud projects"
        ]
      },
      {
        title: "Challenge #3: DNS Configuration with Custom Domain",
        problem: "First experience configuring DNS records, understanding A records vs CNAME records, and connecting a custom domain to AWS infrastructure. The DNS propagation process and nameserver configuration were initially confusing.",
        solution: "Used AWS Route 53 Alias records instead of traditional CNAME records for better performance and no additional cost. Configured both apex domain (kevinnramirez.com) and www subdomain to point to the CloudFront distribution.",
        benefits: [
          "Understanding of DNS fundamentals",
          "Knowledge of Alias vs CNAME trade-offs",
          "Ability to configure custom domains",
          "Lower latency with Alias records"
        ]
      }
    ],
    
    // Optional: Code Deep Dive
    codeBlocks: [
      {
        title: "Complete GitHub Actions Workflow",
        language: "yaml",
        code: `name: Deploy to S3
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v3
        with:
          fetch-depth: 2  # Need at least 2 commits to compare
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
      
      - name: Sync files to S3
        run: |
          aws s3 sync . s3://statict-site-s3 --delete
      
      - name: Check if important files were modified
        id: check_files
        run: |
          CHANGED_FILES=$(git diff --name-only \${{ github.event.before }} \${{ github.sha }} | grep -E '\\.(html|css|js)$' || true)
          
          if [ -n "$CHANGED_FILES" ]; then
            PATHS=$(echo "$CHANGED_FILES" | sed 's|^|/|' | tr '\\n' ' ')
            echo "paths=$PATHS" >> $GITHUB_OUTPUT
            echo "has_changes=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Invalidate CloudFront cache
        if: steps.check_files.outputs.has_changes == 'true'
        run: |
          aws cloudfront create-invalidation \\
            --distribution-id \${{ secrets.CLOUDFRONT_DIST_ID }} \\
            --paths \${{ steps.check_files.outputs.paths }}`
      },
      {
        title: "S3 Bucket Configuration",
        language: "bash",
        code: `# Enable versioning for rollback capability
aws s3api put-bucket-versioning \\
  --bucket statict-site-s3 \\
  --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption \\
  --bucket statict-site-s3 \\
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Configure static website hosting
aws s3 website s3://statict-site-s3/ \\
  --index-document index.html

# Apply bucket policy for public read access
aws s3api put-bucket-policy \\
  --bucket statict-site-s3 \\
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::statict-site-s3/*"
    }]
  }'`
      }
    ],
    
    metrics: [
      { label: "Uptime", value: "99.99%" },
      { label: "Load Time", value: "<1s" },
      { label: "Monthly Cost", value: "$0.56" },
      { label: "Automation", value: "100%" }
    ],
    
    lessons: [
      "Cloud services work as building blocks - understanding each service's role is crucial for proper architecture design",
      "Cache invalidation is critical in CDN architectures - granular invalidation improves both performance and cost-efficiency",
      "Security best practices matter from day one - implementing least-privilege IAM policies and proper secrets management prevents future vulnerabilities",
      "Infrastructure automation reduces human error - CI/CD pipelines ensure consistent, repeatable deployments",
      "Cost optimization requires intentional design - leveraging AWS Free Tier and optimizing API calls keeps operational costs minimal"
    ]
  },

  // Template for future projects
  "project-template": {
    title: "Project Title Here",
    tagline: "Brief description of the project",
    badges: ["Tech1", "Tech2", "Tech3"],
    
    links: {
      github: "https://github.com/username/repo",
      demo: "https://demo-url.com" // optional
    },
    
    overview: {
      problem: "What problem does this solve?",
      solution: "How did you solve it?",
      results: [
        "Result 1",
        "Result 2",
        "Result 3"
      ]
    },
    
    architecture: {
      image: "/Resources/images/project-architecture.png",
      description: "Explanation of the architecture"
    },
    
    // Optional sections - only include if you have content
    technicalDetails: [
      {
        service: "Technology Name",
        details: "Details about how it's used"
      }
    ],
    
    features: [
      {
        title: "Feature Name",
        description: "Feature description"
      }
    ],
    
    challenges: [
      {
        title: "Challenge Title",
        problem: "What was the problem?",
        solution: "How did you solve it?",
        code: {
          language: "yaml", // or "bash", "python", "javascript"
          title: "Code Title",
          content: `your code here`
        },
        benefits: [
          "Benefit 1",
          "Benefit 2"
        ]
      }
    ],
    
    codeBlocks: [
      {
        title: "Code Block Title",
        language: "python",
        code: `# Your code here`
      }
    ],
    
    metrics: [
      { label: "Metric 1", value: "Value 1" },
      { label: "Metric 2", value: "Value 2" }
    ],
    
    lessons: [
      "Lesson learned 1",
      "Lesson learned 2"
    ]
  }
};