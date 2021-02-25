pragma solidity ^0.4.24;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    modifier isNotZeroAddress(address account) {
        require(account != address(0), "Zero address received");
        _;
    }

    /**
     * @dev give an account access to this role
     */
    function add(Role storage role, address account)
        internal
        isNotZeroAddress(account)
    {
        require(!has(role, account), "role already exists");
        role.bearer[account] = true;
    }

    /**
     * @dev remove an account's access to this role
     */
    function remove(Role storage role, address account)
        internal
        isNotZeroAddress(account)
    {
        require(has(role, account), "role doesnt exist");
        role.bearer[account] = false;
    }

    /**
     * @dev check if an account has this role
     * @return bool
     */
    function has(Role storage role, address account)
        internal
        view
        isNotZeroAddress(account)
        returns (bool)
    {
        return role.bearer[account];
    }
}
