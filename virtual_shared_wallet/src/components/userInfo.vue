<template>
    <div>
        <div>
            <span id="id_user_name">{{userName}}</span>
        </div>
        <div>
            <span>支払金額</span>
            <span id="id_user_payed_mount">{{userPayedMount}}</span>
            <p>
                <input type="number"><button id="id_button_pay">加算</button>
            </p>
        </div>
        <div>
            <span>調整金額</span>
            <span id="id_user_mount_to_split_pay">{{userMountToSplitPay}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'userInfo',
    data: function(){
        return {
            userName: "割り勘太郎",
            userPayedMount: 0,
            userMountToSplitPay: 0
        }
    }
}
</script>
