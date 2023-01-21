/**
 *
 * PluginIcon
 *
 */

import React from 'react';
import styled from 'styled-components';
import Puzzle from '@strapi/icons/Puzzle';
import { Flex } from '@strapi/design-system/Flex';

const IconBox = styled(Flex)`
    background-color: #f0f0ff; /* primary100 */
    border: 1px solid #d9d8ff; /* primary200 */

    svg > path {
        fill: #4945ff; /* primary600 */
    }
`;
const PluginIcon = () => (
  <IconBox justifyContent="center" alignItems="center" width={7} height={6} hasRadius aria-hidden>
    <Puzzle />
  </IconBox>
);

export default PluginIcon;
