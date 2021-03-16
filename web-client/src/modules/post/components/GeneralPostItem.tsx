import React from 'react';
import { Post } from 'src/models/posts/Post';
import styled from 'styled-components';

import { COLORS } from '../../../theme/colors';

const PostItem: React.FC<{
  post: Post;
  handleRequest: (action?: boolean) => void;
}> = ({ post, handleRequest }): React.ReactElement => {
  const handleRequestClick = () => {
    handleRequest();
  };

  return (
    <Item onClick={handleRequestClick}>
      <PostItemText>
        <Title style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{post.title}</Title>
        <InnerText style={{ marginBottom: '20px' }}>
          {post.description}
        </InnerText>
      </PostItemText>
    </Item>
  );
};

const Item = styled.div`
  overflow: auto;
  margin: 15px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid ${COLORS.strokeCards};
  border-radius: 2px;
`;

const PostItemText = styled.div`
  float: left;
  font-family: Roboto, sans-serif;
  color: rgba(0, 0, 0, 0.65);
  padding: 5px;
`;

const Title = styled.h4`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 5px;
`;

const InnerText = styled.p`
  margin-bottom: 3px;
  font-family: Roboto, sans-serif;
`;

export default PostItem;
