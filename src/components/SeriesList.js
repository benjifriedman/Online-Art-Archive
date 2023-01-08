import React from 'react'
import {Link} from 'gatsby'
import styled from 'styled-components'
import Anim from './Anim'

const List = styled.div`
 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

const SeriesList = ({ series }) => {
  return (
    <>
      <section>

        <List>
          {series.map(({ node }, index) => {
            // return <li key={index} post={name}><Link to={slug}>{node}</Link></li>
            <li key={index}>{node.name}</li>
          })}
        </List>
      </section>
    </>
  )
}

export default SeriesList
