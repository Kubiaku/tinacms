import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import {
  useCMS,
  useCMSForm,
  withPlugin,
  usePlugin,
} from "@tinacms/react-tinacms"
import { createRemarkButton } from "@tinacms/react-tinacms-remark"

const CreatePostPlugin = createRemarkButton({
  label: "Create Blog Post",
  filename(title) {
    return `content/blog/${title.replace(/\s+/g, "-").toLowerCase()}/index.md`
  },
  frontmatter(title) {
    // Asynchronously generate front matter by fetching data from some server.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title,
          date: new Date(),
          heading_color: "pink",
          description: "My new post. ",
        })
      }, 1000)
    })
  },
  body(title) {
    return `# ${title}`
  },
})

function BlogIndex(props) {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  const [styles] = useCMSForm({
    name: "blog-index-styles",
    initialValues: {
      backgroundColor: "",
      hideBio: false,
      date: "2019 03 04",
    },
    fields: [
      {
        name: "backgroundColor",
        label: "Heading Color",
        component: "color",
        colorFormat: "HeX",
      },
      {
        name: "hideBio",
        label: "Hide Bio",
        component: "toggle",
      },
      {
        name: "date",
        label: "Date",
        component: "date",
        dateFormat: "YYYY MM DD",
        timeFormat: null,
      },
    ],
    onSubmit() {
      alert("Saving doesn't do anything.")
    },
  })
  return (
    <Layout location={props.location} title={siteTitle}>
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <SEO title="All posts" />
        {!styles.hideBio && <Bio />}
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                  ...styles,
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default withPlugin(BlogIndex, CreatePostPlugin)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date
            title
            description
          }
        }
      }
    }
  }
`
