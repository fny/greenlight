import React from "react"; // we need this to make JSX compile
import pluralize from "pluralize"

type PluralizeProps = {
  word: string
  count?: number
  inclusive?: boolean
};

const Pluralize = ({ word, count, inclusive }: PluralizeProps) => {
  const phrase = pluralize(word, count, inclusive)
  return ( <span>{phrase}</span> );
}

export default Pluralize
