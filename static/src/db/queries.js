const createOrder = async (wechatId, pickUpDate, pickUpLocation, total, orderDetails) => {
    const result = await pool.query(
        'INSERT INTO orders (wechat_id, pick_up_date, pick_up_location, total, order_details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [wechatId, pickUpDate, pickUpLocation, total, orderDetails]
    );
    return result.rows[0];
};

module.exports = { createOrder };
