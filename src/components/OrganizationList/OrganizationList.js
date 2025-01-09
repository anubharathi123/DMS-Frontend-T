import React, { useState } from 'react';
import './OrganizationList.css';

const OrganizationList = () => {

return (
    <div className="organization-container">
        <h1 className='organization-h1'>
            Organization List
        </h1>
        <div className='organization-table'>
        <table>
            <tr className='organization-table-header'>
                <th className='organization-table-th'>Organization Name</th>
                <th className='organization-table-th'>Date</th>
                <th className='organization-table-th'>Active/Inactive</th>
                <th className='organization-table-th'>Actions</th>
            </tr>
            <tr>
                <td className='organization-table-td'>Organization 1</td>
                <td className='organization-table-td'>01/01/2021</td>
                <td className='organization-table-td'>Active</td>
                <td className='organization-table-td'>
                    <button className='organization-table-btn'>Edit</button>
                    <button className='organization-table-btn'>Delete</button>
                </td>
            </tr>
            <tr>
                <td className='organization-table-td'>Organization 2</td>
                <td className='organization-table-td'>01/01/2021</td>
                <td className='organization-table-td'>Active</td>
                <td className='organization-table-td'>
                    <button className='organization-table-btn'>Edit</button>
                    <button className='organization-table-btn'>Delete</button>
                </td>
            </tr>
            <tr>
                <td className='organization-table-td'>Organization 3</td>
                <td className='organization-table-td'>01/01/2021</td>
                <td className='organization-table-td'>Active</td>
                <td className='organization-table-td'>
                    <button className='organization-table-btn'>Edit</button>
                    <button className='organization-table-btn'>Delete</button>
                </td>
            </tr>
        </table>
        </div>
    </div>

        
);
};
export default OrganizationList;