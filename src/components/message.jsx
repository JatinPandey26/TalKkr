import React from 'react'
import '../index.css'
import { VStack , Avatar , HStack } from '@chakra-ui/react'
const Message = ({text,user,uri}) => {
  return (
    
      <HStack  alignSelf={user === 'me' ? 'flex-end' : 'flex-start'} flexDirection={user==='me'?'row':'row-reverse' }>
        <div id={user ==='me' ? 'myMssg' : 'otherMssg'}>{text}</div>
        <Avatar src = {uri} ></Avatar>
      </HStack>
  
  )
}

export default Message