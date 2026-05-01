---
title: arch 安装教程
date: 2026-04-30 21:30:41
tags:
    - Linux
categories:
    - Linux
    - 手写
except: arch 安装教程
---

## SSH

```bash
passwd
systemctl start sshd
systemctl status sshd
ip -br a s
```

---

## 禁用 reflector 服务

reflector 服务会自动更新 mirrorlist，容易对某些有用的源信息造成影响，这里不需要。

```bash
systemctl stop reflector.service
systemctl status reflector.service
```

---

## 确认是否为 UEFI 模式

现在基本都是 UEFI 模式，如果是老电脑是 BIOS 的话，在分区安装引导时会有一些区别，这里默认都是 UEFI 模式。

```bash
ls /sys/firmware/efi/efivars
```

如果输出了一堆内容（efi 变量），则说明已在 UEFI 模式。

---

## 配置 DNS（推荐）

```bash
echo "nameserver 8.8.8.8" > /etc/resolv.conf
echo "nameserver 114.114.114.114" >> /etc/resolv.conf
```

---

## 更新系统时钟

部分程序对系统时钟有要求。

```bash
timedatectl set-ntp true # 将系统时间与网络时间进行同步
timedatectl status       # 检查服务状态
```

---

## 换源

```bash
cat > /etc/pacman.d/mirrorlist << 'EOF'
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.aliyun.com/archlinux/$repo/os/$arch
Server = https://mirrors.163.com/archlinux/$repo/os/$arch
EOF

# 刷新数据库
pacman -Sy
```

---

## 分区

首先通过 `fdisk -l` 命令查看硬盘情况。

```bash
fdisk /dev/sda
# 参数如下：
# n g 1 (default) +500M
# n (default _p) (default) (default) +2G
# n (default) (default) (default) (default)
# wq
```

详细分区步骤：

```bash
# 1. 进入 fdisk
fdisk /dev/sda

# 2. 在 fdisk 交互模式中执行：
g                    # 创建新的 GPT 分区表（这一步是关键！）
n                    # 新建分区
分区号: 1            # 回车默认
起始扇区: 回车默认
大小: +500M          # EFI 分区 500M
t                    # 修改分区类型
1                    # 选择分区1
1                    # 类型代码 1 = EFI System

n                    # 新建分区
分区号: 2            # 回车默认
起始扇区: 回车默认
大小: +2G            # 可选，作为 /boot 或 swap
# 保持默认类型 Linux filesystem

n                    # 新建分区
分区号: 3            # 回车默认
起始扇区: 回车默认
大小: 回车默认       # 剩余全部
# 保持默认类型 Linux filesystem

w                    # 写入并退出

# 修改分区1的类型
Command (m for help): t
Partition number (1-3, default 3): 1
Partition type or alias (type L to list all): 1
# 1 = EFI System

# 可选：修改分区2的类型（如果作为 swap）
Command (m for help): t
Partition number (1-3, default 3): 2
Partition type or alias: 19
# 19 = Linux swap

# 分区3保持默认的 Linux filesystem (20)
```

---

## 格式化分区

通过前面的操作，我们已经创建好了分区，但还必须完成分区的格式化才能使用。由于我们想配合 UEFI 模式引导系统，所以把第一个分区格式化为 FAT32 格式。

```bash
mkfs.fat -F32 /dev/sda1
```

第二个分区作为交换分区：

```bash
mkswap /dev/sda2
swapon /dev/sda2
```

将第三个分区格式化为 ext4：

```bash
mkfs.ext4 /dev/sda3
```

将第三个分区挂载到 `/mnt` 目录下：

```bash
mount /dev/sda3 /mnt
```

---

## 安装 Arch

重新安装密钥：

```bash
pacman -S archlinux-keyring
```

安装系统：

```bash
pacstrap -K /mnt base base-devel linux linux-headers linux-firmware
```

安装工具：

```bash
arch-chroot /mnt
pacman -S --noconfirm \
    networkmanager \
    vim nano \
    sudo \
    zsh zsh-completions \
    bash bash-completion \
    ntfs-3g \
    openssh
exit
```

安装 CPU 微码：

```bash
arch-chroot /mnt
pacman -S intel-ucode # 或 amd-ucode
exit
```

---

## 生成 fstab 文件

使用 `genfstab` 自动根据当前挂载情况生成并写入 `fstab` 文件，`-U` 表示以 UUID 方式挂载配置。

```bash
genfstab -U /mnt > /mnt/etc/fstab
```

检查配置情况：

```bash
cat /mnt/etc/fstab
```

---

## chroot 切换根硬盘

把系统环境切换到新安装的系统：

```bash
arch-chroot /mnt
```

---

## 设置主机名和时区

配置主机名：

```bash
vim /etc/hostname
```

设置时区（在 `/etc/localtime` 下用 `/usr/share/zoneinfo/` 中合适的时区创建符号链接）：

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

硬件时间设置（将系统时间同步到硬件）：

```bash
hwclock --systohc
```

---

## 设置 locale

Locale 决定了软件使用的语言、书写习惯和字符集。

编辑 `/etc/locale.gen`，去掉 `en_US.UTF-8 UTF-8` 以及 `zh_CN.UTF-8 UTF-8` 行前的注释符号（#）：

```bash
vim /etc/locale.gen
```

生成 locale：

```bash
locale-gen
```

向 `/etc/locale.conf` 写入内容：

```bash
echo 'LANG=en_US.UTF-8'  > /etc/locale.conf
```

设置 root 密码：

```bash
passwd root
```

---

## 安装引导程序

安装 GRUB 到 EFI 分区：

```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH
```

> 这里使用的是 `/boot` 作为 EFI 分区，所以 `--efi-directory=/boot`，`--bootloader-id=ARCH` 是名称，会安装到 `/boot/EFI/ARCH/grubx64.efi`。

编辑 `/etc/default/grub` 配置：

```bash
vim /etc/default/grub
```

- 去掉 `GRUB_CMDLINE_LINUX_DEFAULT` 一行中最后的 `quiet` 参数（`quiet` 指隐藏详细信息）
- 把 `loglevel` 的数值从 3 改成 5（方便后续排错）
- 加入 `nowatchdog` 参数（看门狗会持续监控系统运转状态，关闭可提高开关机速度）
- 多系统引导需要在底部添加 `GRUB_DISABLE_OS_PROBER=false` 来启用 os-prober 功能

生成 GRUB 配置文件：

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

---

# 完成安装

## 创建普通用户

```bash
useradd -m -G wheel 用户名
```

创建用户密码：

```bash
passwd 用户名
```

开放 wheel 组管理权限以赋予用户 root 权限：

```bash
visudo
```

删除 `%wheel ALL=(ALL:ALL) ALL` 前的 `#`，启用该行。

---

## 启用安装的服务

```bash
systemctl enable NetworkManager
systemctl enable sshd
```

---

## 基础安装退出

```bash
exit                # 退回安装环境
umount -R /mnt      # 卸载新分区
reboot              # 重启
```

---

# 桌面安装

## KDE 桌面环境安装

```bash
pacman -S plasma-meta sddm
```

启动 sddm 显示管理器：

```bash
systemctl enable sddm
```

其余步骤参考 [CSDN](https://blog.csdn.net/2302_80167491/article/details/151927031)