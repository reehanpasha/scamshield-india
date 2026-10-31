import ipaddress
import socket
from urllib.parse import urlparse
from typing import Tuple

BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),       # AWS / GCP metadata
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.0.0.0/24"),
    ipaddress.ip_network("192.0.2.0/24"),
    ipaddress.ip_network("192.88.99.0/24"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("198.18.0.0/15"),
    ipaddress.ip_network("198.51.100.0/24"),
    ipaddress.ip_network("203.0.113.0/24"),
    ipaddress.ip_network("224.0.0.0/4"),          # Multicast
    ipaddress.ip_network("240.0.0.0/4"),          # Reserved
    ipaddress.ip_network("255.255.255.255/32"),
    # IPv6
    ipaddress.ip_network("::/128"),
    ipaddress.ip_network("::1/128"),              # Loopback
    ipaddress.ip_network("fc00::/7"),             # Unique local
    ipaddress.ip_network("fe80::/10"),            # Link-local
    ipaddress.ip_network("ff00::/8"),             # Multicast
]

def is_ip_private_or_restricted(ip_str: str) -> bool:
    """Returns True if the IP address belongs to loopback, private, or restricted ranges."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return any(ip in net for net in BLOCKED_IP_NETWORKS)
    except ValueError:
        return False

def validate_url_safety_ssrf(url: str) -> Tuple[bool, str]:
    """
    Validates that a URL does NOT point to localhost, private cloud metadata,
    or internal networks. Does NOT make any network connection.
    """
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname
        if not hostname:
            return False, "Invalid or missing hostname in URL"

        # Check if hostname itself is directly an IP
        try:
            ip = ipaddress.ip_address(hostname)
            if any(ip in net for net in BLOCKED_IP_NETWORKS):
                return False, f"Host {hostname} is a restricted or private IP address"
            return True, "Public IP"
        except ValueError:
            pass

        # Check for obvious localhost strings
        lower_host = hostname.lower()
        if lower_host in ["localhost", "metadata.google.internal", "instance-data"]:
            return False, f"Host {hostname} is a restricted internal name"
        
        if lower_host.endswith(".internal") or lower_host.endswith(".local") or lower_host.endswith(".localhost"):
            return False, f"Domain {hostname} resolves to local or private namespace"

        return True, "Safe URL structure"
    except Exception as e:
        return False, f"URL parse error: {str(e)}"
