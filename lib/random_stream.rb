module RandomStream
  COLORS = %w[
    red orange yellow green blue purple brown
    pink orange teal jade ruby lime teal violet
    silver gold navy brave calm gentle happy jolly kind
    big silly witty good best brainy calm clever
    clean lucky long modern odd open rich smiling
    splendid zany wild big full free local new speical strong
    real
  ].uniq.freeze
  THINGS = %w[
    dream season music dance song drum buzz bloom jump move groove wave spring
    peak
    spoon fork cup plate dish coffee tea cake pie glass
    bistro cafe bar lunch
    penguin lion leopard cake tiger crab fish owl dog cat puppy guppy kitty
    bear bird bull shell
    friend hand
    car bus truck bike ship train boat
    earth fire water wind ice
    candy bunny story party
    cherry apple peach pear plum
    place point time world beach
    house tent cabin cave room den base
    brain branch
    gift dawn
    course
    family
    sugar
    nature
    peace
    angle
    brush
    bread bonus buddy bunch
  ].uniq.freeze

  module_function def things
    THINGS.sample
  end

  module_function def colors
    COLORS.sample
  end
end
