import React from "react"
import { useTranslation } from "react-i18next"

import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import { Wrapper, TopSection, ContentWrapper } from "./style"

function Mission() {
  const { t } = useTranslation()
  const data = useStaticQuery(
    graphql`
      query {
        markdownRemark(frontmatter: { title: { eq: "Mission" } }) {
          html
        }
        file(relativePath: { eq: "sections/mission/mission/image.png" }) {
          childImageSharp {
            fluid(maxWidth: 500, quality: 75) {
              base64
              aspectRatio
              src
              srcSet
              sizes
            }
          }
        }
      }
    `,
  )

  return (
    <>
      <TopSection>
        {/* 200 IQ NAMING RIGHT HERE */}
        <h1>{t("MissionPage.topHeading")}</h1>
      </TopSection>
      <Wrapper id="mission">
        <div className="imageWrapper">
          <Img fluid={data.file.childImageSharp.fluid} alt="R4H Mission" />
        </div>
        <ContentWrapper>
          <h2>{t("MissionPage.heading")}</h2>
          <p>{t("MissionPage.description.0")}</p>
          <br />
          <p>{t("MissionPage.description.1")}</p>
          <br />
          <p>{t("MissionPage.description.2")}</p>
        </ContentWrapper>
      </Wrapper>
    </>
  )
}

export default Mission
