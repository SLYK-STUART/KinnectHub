def get_user_family(user):
    """
    Every family member has exactly one Family tree node, which
    links to a single family
    """
    return user.tree_node.family