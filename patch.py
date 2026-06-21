import sys
js = open("C:/Users/Administrator/Documents/New project/app.js", "r", encoding="utf-8").read()

# 1. Replace RSM function
old_rsm = "function RSM(){return'<div class=\"modal-overlay\" onclick=\"event.target===this&&closeModal()\"><div class=\"modal\" style=\"max-width:460px\"><div class=\"modal-header\"><h3>设置</h3><button class=\"modal-close\" onclick=\"closeModal()\">&times;</button></div><div class=\"modal-body\"><div class=\"set-sec\"><h3>用户信息</h3><div class=\"dg\"><div class=\"di\"><div class=\"dl\">用户名</div><div class=\"dv\">'+eh(S.user.name)+'</div></div><div class=\"di\"><div class=\"dl\">角色</div><div class=\"dv\">'+rn(S.user.role)+'</div></div></div></div><div class=\"set-sec\"><h3>修改密码</h3><div class=\"fg\" style=\"margin-bottom:8px\"><label>当前密码</label><input type=\"password\" id=\"st-op\"></div><div class=\"fg\" style=\"margin-bottom:8px\"><label>新密码</label><input type=\"password\" id=\"st-np\"></div><div class=\"fg\" style=\"margin-bottom:12px\"><label>确认新密码</label><input type=\"password\" id=\"st-cp\"></div><button class=\"btn btn-b\" onclick=\"chPwd()\">修改密码</button></div><div class=\"set-sec\" style=\"border-top:1px solid #eee;padding-top:16px;margin-top:16px\"><button class=\"btn btn-r\" onclick=\"doLogout();closeModal()\">退出登录</button></div></div></div></div>'}"

new_rsm = "function RSM(){return'<div class=\"modal-overlay\" onclick=\"event.target===this&&closeModal()\"><div class=\"modal\" style=\"max-width:460px\"><div class=\"modal-header\"><h3>设置</h3><button class=\"modal-close\" onclick=\"closeModal()\">&times;</button></div><div class=\"modal-body\"><div class=\"set-sec\"><h3>用户信息</h3><div class=\"dg\"><div class=\"di\"><div class=\"dl\">用户名</div><div class=\"dv\">'+eh(S.user.name)+'</div></div><div class=\"di\"><div class=\"dl\">角色</div><div class=\"dv\">'+rn(S.user.role)+'</div></div></div></div><div class=\"set-sec\"><h3>修改密码</h3><div class=\"fg\" style=\"margin-bottom:8px\"><label>当前密码</label><input type=\"password\" id=\"st-op\"></div><div class=\"fg\" style=\"margin-bottom:8px\"><label>新密码</label><input type=\"password\" id=\"st-np\"></div><div class=\"fg\" style=\"margin-bottom:12px\"><label>确认新密码</label><input type=\"password\" id=\"st-cp\"></div><button class=\"btn btn-b\" onclick=\"chPwd()\">修改密码</button></div><div class=\"set-sec\"><h3>数据同步</h3><p style=\"font-size:12px;color:#888;margin-bottom:8px\">配置GitHub Token用于云端数据同步</p><div class=\"fg\" style=\"margin-bottom:6px\"><label>GitHub Token</label><input type=\"password\" id=\"st-gt\" value=\"'+(localStorage.getItem(\"github_token\")||\"\")+'\" placeholder=\"ghp_...\"></div><button class=\"btn btn-b\" onclick=\"saveGithubToken()\">保存令牌</button></div><div class=\"set-sec\" style=\"border-top:1px solid #eee;padding-top:16px;margin-top:16px\"><button class=\"btn btn-r\" onclick=\"doLogout();closeModal()\">退出登录</button></div></div></div></div>'}"

js = js.replace(old_rsm, new_rsm)

# 2. Update loadData
old_load = "function loadData(){S.load=true;R();GitHubAPI.readData().then(function(d){if(d){S.reqs=d.requests||[];S.vehs=d.vehicles||[];S.drvs=d.drivers||[];S.cfg=d.config||{};S.sync=\"ok\"}else{S.sync=\"err\"}S.load=false;R()})}"
new_load = "function loadData(){S.load=true;R();if(!CONFIG.githubToken){S.sync=\"err\";S.load=false;toast(\"请先在设置中配置GitHub Token\",\"error\");R();return}GitHubAPI.readData().then(function(d){if(d){S.reqs=d.requests||[];S.vehs=d.vehicles||[];S.drvs=d.drivers||[];S.cfg=d.config||{};S.sync=\"ok\"}else{S.sync=\"err\"}S.load=false;R()})}"
js = js.replace(old_load, new_load)

# 3. Update saveData
old_save = "function saveData(){var d={requests:S.reqs,vehicles:S.vehs,drivers:S.drvs,config:S.cfg};S.sync=\"saving\";R();GitHubAPI.writeData(d).then(function(ok){S.sync=ok?\"ok\":\"err\";if(ok)svLocal(d);R()})}"
new_save = "function saveData(){var d={requests:S.reqs,vehicles:S.vehs,drivers:S.drvs,config:S.cfg};if(!CONFIG.githubToken){S.sync=\"err\";toast(\"请先在设置中配置GitHub Token\",\"error\");R();return}S.sync=\"saving\";R();GitHubAPI.writeData(d).then(function(ok){S.sync=ok?\"ok\":\"err\";if(ok)svLocal(d);R()})}"
js = js.replace(old_save, new_save)

# 4. Add saveGithubToken function
js += "function saveGithubToken(){var t=document.getElementById(\"st-gt\").value.trim();if(!t){toast(\"请输入GitHub Token\",\"error\");return}localStorage.setItem(\"github_token\",t);CONFIG.githubToken=t;toast(\"令牌已保存\",\"success\")}"

open("C:/Users/Administrator/Documents/New project/app.js", "w", encoding="utf-8").write(js)
print("Done")
