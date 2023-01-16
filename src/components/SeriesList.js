import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import Anim from './Anim'

const List = styled.div`
   {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`

const ListItem = styled.div`
   {
    list-style: none;
    margin-right: 1rem;
  }
`

const SeriesList = ({ series }) => {
  return (
    <>
      <section>
        <List>
          {series.map(({ node }, i) => {
            const { name, slug } = node
            return (
              <ListItem key={i} post={name}>
                <Link to={slug}>{name}</Link>
              </ListItem>
            )
          })}
        </List>
      </section>
    </>
  )
}

export default SeriesList
